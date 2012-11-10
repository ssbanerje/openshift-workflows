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

* Run the application

```bash
$ node app.js
```

## Configuration files
This application was built to be used with the FreeShift or MegaShift service provided on the [Red Hat Cloud](https://openshift.redhat.com/). However, it can be used with any deployment of the [Openshift Origin](https://github.com/openshift). If however, you have tweaked this to include non-standard cartridges and templates, it may be required to make changes in the following configuration files -

* public/conf/images.json - This file controls the images that are used to display cartridges on the screen.
* public/conf/templates.json - This file controls the images that are used to display templates on the screen.
* public/conf/rules.json - This file defines dependencies between cartridges and templates, so that a semantically correct workflow can be defined.


## Useful Links
### Openshift
* [Openshift Architecture Specification](https://openshift.redhat.com/community/wiki/architecture-overview)
* [Openshift User Guide](https://openshift.redhat.com/community/sites/default/files/documents/OpenShift-2.0-User_Guide-en-US.pdf)
* [Openshift REST API Guide](https://openshift.redhat.com/community/sites/default/files/documents/OpenShift-2.0-REST_API_Guide-en-US_0.pdf)

### Technology reference
* [HTML5 Rocks](http://www.html5rocks.com/en/)
* [jQuery](http://jquery.com/) ( + [jQuery-UI](http://jqueryui.com/) )
* [Bootstrap](http://twitter.github.com/bootstrap/)
* [modernizr](http://modernizr.com/)
* [AngularJS](http://angularjs.org/) ( + [Angular-UI](http://angular-ui.github.com/) + [Angular-jQuery-UI](https://github.com/danielzen/angular-jquery-ui) )
* [jsPlumb](https://github.com/danielzen/angular-jquery-ui)
* [SpinJS](http://fgnass.github.com/spin.js/)