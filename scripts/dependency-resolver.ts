import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface DependencyInfo {
  name: string;
  currentVersion: string;
  requiredVersions: Set<string>;
  satisfiedBy: string[];
  requiredBy: Map<string, string>; // package -> version requirement
}

async function getNpmVersions(packageName: string): Promise<string[]> {
  try {
    const versions = execSync(`npm view ${packageName} versions --json`, { encoding: 'utf8' });
    return JSON.parse(versions);
  } catch (error) {
    console.error(`Error fetching versions for ${packageName}:`, error);
    return [];
  }
}

function findOptimalVersion(versions: string[], requirements: Set<string>): string | null {
  const allVersions = versions.sort(semver.rcompare);
  
  for (const version of allVersions) {
    let satisfiesAll = true;
    for (const requirement of requirements) {
      if (!semver.satisfies(version, requirement)) {
        satisfiesAll = false;
        break;
      }
    }
    if (satisfiesAll) {
      return version;
    }
  }
  
  return null;
}

function generateFixCommands(dependencies: Record<string, DependencyInfo>): string[] {
  const commands: string[] = [];
  const reactInfo = dependencies['react'];
  const reactDomInfo = dependencies['react-dom'];

  // If both react and react-dom exist, ensure they're on the same version
  if (reactInfo && reactDomInfo) {
    const reactVersion = reactInfo.currentVersion;
    const reactDomVersion = reactDomInfo.currentVersion;

    if (reactVersion !== reactDomVersion) {
      // Find the lower major version between the two
      const reactMajor = semver.major(reactVersion);
      const reactDomMajor = semver.major(reactDomVersion);
      const targetMajor = Math.min(reactMajor, reactDomMajor);
      
      commands.push(`# Fix React version mismatch:`);
      commands.push(`npm install react@${targetMajor}.0.0 react-dom@${targetMajor}.0.0`);
    }
  }

  return commands;
}

async function analyzeDependencies(packageJsonPath: string): Promise<void> {
  console.log(`Analyzing dependencies in: ${packageJsonPath}\n`);
  const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies: Record<string, DependencyInfo> = {};

  // Combine all dependencies
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };

  // Initialize dependency info
  for (const [name, version] of Object.entries(allDeps)) {
    dependencies[name] = {
      name,
      currentVersion: version.replace(/^\^|~/, ''),
      requiredVersions: new Set([version]),
      satisfiedBy: [],
      requiredBy: new Map()
    };
  }

  // Analyze installed packages for peer dependencies
  const nodeModulesPath = path.join(path.dirname(packageJsonPath), 'node_modules');
  console.log(`Looking for node_modules in: ${nodeModulesPath}\n`);
  
  for (const depName of Object.keys(dependencies)) {
    try {
      const depPackageJsonPath = path.join(nodeModulesPath, depName, 'package.json');
      if (fs.existsSync(depPackageJsonPath)) {
        const depPackageJson: PackageJson = JSON.parse(fs.readFileSync(depPackageJsonPath, 'utf8'));
        
        if (depPackageJson.peerDependencies) {
          for (const [peerName, peerVersion] of Object.entries(depPackageJson.peerDependencies)) {
            if (dependencies[peerName]) {
              dependencies[peerName].requiredVersions.add(peerVersion);
              dependencies[peerName].requiredBy.set(depName, peerVersion);
              console.log(`Found peer dependency: ${depName} requires ${peerName}@${peerVersion}`);
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not analyze peer dependencies for ${depName}`);
    }
  }

  // Find optimal versions
  console.log('\nAnalyzing version conflicts...\n');
  
  for (const dep of Object.values(dependencies)) {
    console.log(`📦 ${dep.name}`);
    console.log(`Current version: ${dep.currentVersion}`);
    console.log('Required versions:');
    dep.requiredVersions.forEach(v => console.log(`  - ${v}`));
    if (dep.requiredBy.size > 0) {
      console.log('Required by:');
      dep.requiredBy.forEach((version, pkg) => {
        console.log(`  - ${pkg} requires ${version}`);
      });
    }
    
    const versions = await getNpmVersions(dep.name);
    const optimalVersion = findOptimalVersion(versions, dep.requiredVersions);
    
    if (optimalVersion) {
      console.log(`Optimal version: ${optimalVersion}`);
      if (optimalVersion !== dep.currentVersion) {
        console.log(`⚠️ Recommended update to version ${optimalVersion}`);
        console.log(`Run: npm install ${dep.name}@${optimalVersion}`);
      }
    } else {
      console.log('❌ No single version satisfies all requirements');
      console.log('Consider reviewing these dependencies manually');
    }
    console.log('-------------------');
  }

  // Generate and show fix commands
  const fixCommands = generateFixCommands(dependencies);
  if (fixCommands.length > 0) {
    console.log('\nSuggested fixes:');
    fixCommands.forEach(cmd => console.log(cmd));
  }
}

// Run the analysis on the parent directory's package.json
const scriptDir = __dirname;
const projectDir = path.resolve(scriptDir, '..');
const packageJsonPath = path.join(projectDir, 'package.json');
analyzeDependencies(packageJsonPath).catch(console.error); 