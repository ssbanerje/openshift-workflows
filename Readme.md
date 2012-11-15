# Openshift Workflows
A client for the [OpenShift](http://www.github.com/openshift) which provides an interface
to the Broker-API for simple deployments as well as more complicated workflows.

![Screenshot](https://raw.github.com/subszero/openshift-workflows/master/public/img/screenshot.png)


## Installation
* Get the latest source code

```bash
$ git clone https://github.com/subszero/openshift-workflows.git
```

* Install NodeJS and NPM from [here](http://nodejs.org)

* Install all dependencies

```bash
$ npm install
```

* Generate new SSL certificates in the `certs/` folder

* Run the server and open the page in a browser

```bash
$ node app.js -b
```

## Configuration files
This application was built to be used with the FreeShift or MegaShift service provided on the [Red Hat Cloud](https://openshift.redhat.com/). However, it can be used with any deployment of the [Openshift Origin](https://github.com/openshift). If however, you have tweaked this to include non-standard cartridges and templates, it may be required to make changes in the following configuration files -

* public/conf/images.json - This file controls the images that are used to display cartridges on the screen.

```javascript
{
    "Node.js 0.6": "/img/icons/nodejs.png",
    "Zend Server 5.6": "/img/icons/zend.png",
    "Ruby 1.9": "/img/icons/ruby.png",
    "JBoss Application Server 7.1": "/img/icons/jboss_as7.png",
    "Python 2.6": "/img/icons/python.png",
    "Jenkins Server 1.4": "/img/icons/jenkins.png",
    "Ruby 1.8": "/img/icons/ruby.png",
    "JBoss Enterprise Application Platform 6.0": "/img/icons/jboss.png",
    "PHP 5.3": "/img/icons/php.png"
}
```
The file stores a hash with the name of the cartridge as key and the location of the corresponding image as value.

* public/conf/templates.json - This file controls the images that are used to display templates on the screen.

```javascript
{
    "CakePHP": "/img/icons/cakephp.png",
    "CakePHP (TEST)": "/img/icons/cakephp_Test.png",
    "Django": "/img/icons/django.png",
    "Django (Test)": "/img/icons/django_Test.png"
}
```
The file stores a hash with the name of the template as key and the location of the corresponding image as value.

* public/conf/rules.json - This file defines dependencies between cartridges and templates, so that a semantically correct workflow can be defined.

```javascript
{
    "cartridge": {
        "rockmongo-1.1": ["mongodb-2.2"],
        "10gen-mms-agent-0.1": ["mongodb-2.2"],
        "phpmyadmin-3.4": ["mysql-5.1"]
    },
    "template": {
        "cakephp": ["mysql-5.1"],
        "drupal": ["mysql-5.1"],
        "rails": ["mysql-5.1"],
        "wordpress": ["mysql-5.1"]
    }
}
```

The configuration file has two parts, the cartridge hash, which stores the dependencies of cartridges, *ie.* `"rockmongo-1.1": ["mongodb-2.2"]` means that RockMongo cannot be installed without MongoDB installed first. The second part of this configuration file, the template hash, stores the embedded cartridges that are installed along with the template, *ie.* `"cakephp": ["mysql-5.1"]` means that CakePHP installs MySQL as one of it's embedded cartridges.


## Useful Links
### Openshift
* [Openshift Architecture Specification](https://openshift.redhat.com/community/wiki/architecture-overview)
* [Openshift User Guide](https://openshift.redhat.com/community/sites/default/files/documents/OpenShift-2.0-User_Guide-en-US.pdf)
* [Openshift REST API Guide](https://openshift.redhat.com/community/sites/default/files/documents/OpenShift-2.0-REST_API_Guide-en-US_0.pdf)

### Application Architecture
[Poster](https://github.com/subszero/openshift-workflows/blob/poster/poster_output.pdf)

#### Technologies used in the backend
* [NodeJS](http://www.nodejs.org/)
* [ExpressJS](http://expressjs.com/) ( + [Embedded JavaScript](http://embeddedjs.com/) )
* [RequestJS](https://github.com/mikeal/request)
* [CommanderJS](http://visionmedia.github.com/commander.js/)



#### Technologies used in the frontend
* [HTML5 Rocks](http://www.html5rocks.com/en/)
* [jQuery](http://jquery.com/) ( + [jQuery-UI](http://jqueryui.com/) )
* [Bootstrap](http://twitter.github.com/bootstrap/)
* [modernizr](http://modernizr.com/)
* [AngularJS](http://angularjs.org/) ( + [Angular-UI](http://angular-ui.github.com/) + [Angular-jQuery-UI](https://github.com/danielzen/angular-jquery-ui) )
* [jsPlumb](https://github.com/danielzen/angular-jquery-ui)
* [SpinJS](http://fgnass.github.com/spin.js/)