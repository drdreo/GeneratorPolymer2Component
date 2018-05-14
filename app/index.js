const Yeoman = require('yeoman-generator');
const path = require('path');
const mkdirp = require('mkdirp');
const glob = require('glob');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// append prefix with name and capitalizes first letters
function generateClassName(prefix,name) {
  return capitalizeFirstLetter(prefix) + name.split('-').reduce((previous, part) => {
    return previous + capitalizeFirstLetter(part);
  }, '');
}

const PROMPTS = [
  {
    name: 'prefix',
    type: 'input',
    store   : true,
    message: 'Give it a prefix (company shorthand, etc..):',
    filter: function(value){
      return value.toLowerCase();
    }
  },
  {
    name: 'name',
    type: 'input',
    required: true,
    message: 'Give it a name (composed with <prefix>-<name>):',
    filter: function(value){
      return value.toLowerCase();
    }
  },

  {
    name: 'attributes',
    type: 'input',
    message: 'What attributes will the element have? (whitespace separated)',
    filter: function(value){
      return value = value.split(" ");
    }
  },
  {
    name: 'createStyleModule',
    type: 'confirm',
    store   : true,
    message: 'Create a Style Module for the element?',
    default: true
  }
];

class GeneratorPolymerComponent extends Yeoman {

  prompting() {
    const done = this.async();
    this.log(`Polymer Element Generator - Let's dive right into it`);

    return this.prompt(PROMPTS).then(answers => {
      this.props = answers;
      done();
    });
  }

  default() {
    const { prefix,  name} = this.props;

    this.props.className = generateClassName(prefix,name);
    this.props.prefixedName = (prefix) ? prefix + "-" + name : name;

    // Check if command got executed inside the components direcotry or we have to create it
    if (path.basename(this.destinationPath()) !== name) {
      this.log(`Created the folder '${name}' :)`);
      mkdirp(name);
      this.destinationRoot(this.destinationPath(name));
    }
  }

  writing() {
    const { prefix, name, createStyleModule, prefixedName} = this.props;
    // Write create element from template
    try{
      this.fs.copyTpl(
        this.templatePath('element.html'),
        this.destinationPath(`${name}.html`),
        this
      );
    }catch(e){
      console.error(e);
    }

    if(createStyleModule){
      try{
        this.fs.copyTpl(
          this.templatePath('style-module.html'),
          this.destinationPath(`${name}-styles.html`),
          this
        );
      }catch(e){
        console.error(e);
      }

    }

  }

  install() {

  }
}

module.exports = GeneratorPolymerComponent;
