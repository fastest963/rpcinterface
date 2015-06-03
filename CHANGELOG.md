## Changelog ##

### 0.0.11 ###
* `array` type is now enforced (`object` still continue to match arrays and objects)
* Bumped version to match rpclib

### 0.0.5 ###
* preProcessor can now return a promise
* Params can now be sent shorthand like: `{ name: 'string' }`

### 0.0.4 ###
* Fixed call breaking when undefined params passed to method with optional params

### 0.0.3 ###
* Fixed call not allowing undefined params
