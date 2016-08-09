```javascript
var critique = require('commonform-wordy')
var assert = require('assert')

assert.deepEqual(
  critique({content: ['in order to']}),
  [
    {
      message: 'Replace "in order to" with "to".',
      level: 'info',
      path: ['content', 0],
      source: 'commonform-wordy',
      url: null
    }
  ]
)
```
