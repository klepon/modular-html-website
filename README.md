# modular-html-website
Simple reusable module for FED mockup or static HTML website

# setup project
$ npm install

# build and running server for development
$ gulp

# build for production
set production to true

set templateData.dev == false on gulp task "handlebars"

on production build, reactjs for production downloaded to source folder, delete those 2 react file in _src/assets/scripts/lib to get development version if build for development

$ gulp

# manually test accessibility

$ gulp test-accessibility

# manually test accessibility

$ gulp html-validator

# modules
accordion

article text

slick carousel

form

popup

sliding door

tabs

multi implementation text image panel

rich text editor / wysiwyg
