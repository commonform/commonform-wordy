/* Copyright 2016 Kyle E. Mitchell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var replacements = require('wordy-words')

var phrases = Object.keys(replacements)
.reduce(function (map, key) {
  var longer = key
  var shorter = replacements[key]
  map[shorter] = {
    phrase: longer,
    re: new RegExp('\\b' + longer + '\\b')
  }
  return map
}, {})

function rule (form, path) {
  return form.content.reduce(function (annotations, element, index) {
    if (typeof element === 'string') {
      var elementPath = path.concat(['content', index])
      Object.keys(phrases).forEach(function (suggestion) {
        var object = phrases[suggestion]
        var regularExpression = object.re
        if (regularExpression.test(element.toLowerCase())) {
          annotations.push({
            level: 'info',
            source: 'commonform-wordy',
            url: null,
            message: (
              'Replace "' + object.phrase +
              '" with "' + suggestion + '".'
            ),
            path: elementPath
          })
        }
      })
    }
    return annotations
  }, [])
}

var recurse = function (form, path, annotations) {
  return annotations
  // Annotations about `form`
  .concat(rule(form, path))
  // Annotations about children of `form`.
  .concat(form.content.reduce(function (annotations, element, index) {
    if (element.hasOwnProperty('form')) {
      var childForm = element.form
      var childPath = path.concat(['content', index, 'form'])
      return annotations.concat(recurse(childForm, childPath, []))
    } else {
      return annotations
    }
  }, []))
}

module.exports = function (form) {
  return recurse(form, [], [])
}
