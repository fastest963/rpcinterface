## Changelog ##

### 0.2.0 ###
* Added explicit handling of null params when adding new method

### 0.1.2 ###
* Allow params to be an array in call

### 0.1.1 ###
* Added `removeMethod`

### 0.1.0 ###
* Exceptions throw in handler will now correctly throw if using promise in preProcessor

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
