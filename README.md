## thrift-parser

To parse thrift file to a AST.

### Demo

```javascript
let thriftParser = require('thrift-parser');

let ast = thriftParser(`

struct MyStruct {
    1: required int id,
    2: required bool field1,
    # 3: required string field,
    4: required i16 field,
}
exception Exception1 {
    1: required i32 error_code,
    2: required string error_name,
    3: optional string message,
}
exception Exception2 {
    1: required i32 error_code,
    2: required string error_name,
    3: optional string message,
}
service Service1 {
    bool ping() throws (1: Exception1 user_exception, 2: Exception2 system_exception)
    list<MyStruct> test(1: MyStruct ms)
        throws (1: Exception1 user_exception, 2: Exception2 system_exception)
}

`);
```

Results

```json
{
  "struct": {
    "MyStruct": [
      {
        "id": 1,
        "option": "required",
        "type": "int",
        "name": "id"
      },
      {
        "id": 2,
        "option": "required",
        "type": "bool",
        "name": "field1"
      },
      {
        "id": 4,
        "option": "required",
        "type": "i16",
        "name": "field"
      }
    ]
  },
  "exception": {
    "Exception1": [
      {
        "id": 1,
        "option": "required",
        "type": "i32",
        "name": "error_code"
      },
      {
        "id": 2,
        "option": "required",
        "type": "string",
        "name": "error_name"
      },
      {
        "id": 3,
        "option": "optional",
        "type": "string",
        "name": "message"
      }
    ],
    "Exception2": [
      {
        "id": 1,
        "option": "required",
        "type": "i32",
        "name": "error_code"
      },
      {
        "id": 2,
        "option": "required",
        "type": "string",
        "name": "error_name"
      },
      {
        "id": 3,
        "option": "optional",
        "type": "string",
        "name": "message"
      }
    ]
  },
  "service": {
    "Service1": {
      "functions": {
        "ping": {
          "type": "bool",
          "name": "ping",
          "args": [],
          "throws": [
            {
              "id": 1,
              "type": "Exception1",
              "name": "user_exception"
            },
            {
              "id": 2,
              "type": "Exception2",
              "name": "system_exception"
            }
          ],
          "oneway": false
        },
        "test": {
          "type": {
            "name": "list",
            "valueType": "MyStruct"
          },
          "name": "test",
          "args": [
            {
              "id": 1,
              "type": "MyStruct",
              "name": "ms"
            }
          ],
          "throws": [
            {
              "id": 1,
              "type": "Exception1",
              "name": "user_exception"
            },
            {
              "id": 2,
              "type": "Exception2",
              "name": "system_exception"
            }
          ],
          "oneway": false
        }
      }
    }
  }
}
```
