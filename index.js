const inquirer = require('inquirer');
const runCmd = require('./src/executeCmd');
const { cyan, green } = require('colorette');

const log = console.log;

log(
    '%cつ ◕_◕༽つ Welcome in project cli',
    'color: blue; font-size: 30px;'
);

inquirer
    .prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the project name ?',
            validate: (name)=>{
                let regex= /^(\w+\.?)*[a-zA-Z_0-9]+$/g;
                return regex.test(name)
             }
        },
        {
            type: 'list',
            name: 'type',
            message: 'Which type of project do you want ?',
            choices: [
                'Javascript',
                'React',
                'Symfony',
                'Next Js',
                'Flutter',
            ]
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Which type of package manager do you want ?',
            choices: [
                'Npm',
                'Yarn',
                'Pnpm',
            ],
            when: (project) => project.type !== 'Symfony' && project.type !== 'Flutter'
        },
        {
            type: 'list',
            name: 'version',
            message: 'Which type of versiondo you want ?',
            choices: [
                '6.0',
                '5.4',
                '4.4',
            ],
            when: (project) => project.type === 'Symfony'
        }
    ]).then((project) => {
        const {type, name, manager, version}  = project;
        log(cyan(`⌛  Génération du project ${type}`));
        if(type === 'Javascript'){
            runCmd('mkdir', ['-p', name])
                .then(_ => {
                    runCmd(manager.toLowerCase(), ['init', '-y', name])
                })
        } else if(type === 'React'){
            if(manager === 'Pnpm'){
                runCmd(manager.toLowerCase(), ['create', 'react-app', name])
            } else {
                runCmd(manager.toLowerCase(), ['create-react-app', name])
            }
        }else if(type === 'Symfony'){
            runCmd('composer', ['create-project', 'symfony/skeleton:^' + version , name])
        } else if(type === 'Next Js'){
            if(manager === 'Pnpm'){
                runCmd(manager.toLowerCase(), ['create', 'next-app', name])
            } else if(manager === 'Yarn'){
                runCmd(manager.toLowerCase(), ['create', 'next-app', name])
            }else {
                runCmd('npx', ['create-react-app@latest', name])
            }
        } else if(type === 'Flutter'){
            runCmd('flutter', ['create', name])
        }
        log(green(`🎊🎉  Création du project ${name} 🎊🎉`))
    })