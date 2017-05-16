namespace php hehe
namespace * haha
include "Status.Type"
include "dotThrift.thrift"
include "a/b/basename"
include "a\b\basenameInWindows"
/******
 * Types
 *****/
typedef string Json
typedef i64 Mobile
typedef string ListSep1;
typedef string ListSep2,
typedef binary Buffer

/**
 * Const
 */const i16 C1 = 123
const string C2 = "456"
const list<i32> C3 = [ 1, 2, 3 ]
const map<i32, string> C4 = { 1: 'a', 2: 'b', 3: 'c' }
const bool C5 = true
const bool C6 = false
const set<i32> C7 = [ 1, 2, 3 ]
const bool C8 = true;
const bool C9 = false,
const i16 C10 = 0x7fff
const i32 C11 = 0x7fffffff
const i16 C12 = -3e4
const i32 C13 = 2.147483647e9

const string chinese_test = "中文测试"
const string japanese_test = "日本語テスト"
const string emoji_test = "😂 "

/**
 * Enum
 */
enum Enum1 {
    TYPE_DISCOVER = 1,
    TYPE_NOTIFY = 2,
}
enum Enum2 {
    OPERATE_TYPE_MANUAL = 1,
    OPERATE_TYPE_AUTO = 2,
}

struct Struct1 {
    1: required int id,
    2: required bool field1,
    # 3: required string field,
    4: required i16 field,
    5: required binary field2
}

struct Struct2 {
    1: required int id,
    2: required Json field1,
    3: required Mobile field2,
    4: required i16 field3,
    5: string field4 = "default value"
}

union Union1 {
  1: string field1;
  2: int field2;
  3: required string withOption;
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

/**
 * Services
 */
service Service1 {
    /**
     * Base services
     */
    bool ping() throws (1: Exception1 user_exception, 2: Exception2 system_exception)

    /**
     * TEST
     */
    list<map<Struct1, Struct2>> test(1: Struct1 s1, 2: Struct2 s2)
      throws (1: Exception1 user_exception, 2: Exception2 system_exception)
    list<set<Struct1>> test2(1: Struct1 s1)
      throws (1: Exception1 user_exception, 2: Exception2 system_exception)
}

/**
 * Services
 */
service Service2 {
    /**
     * Base services
     */
    bool ping(),

    oneway void foo(),

    /**
     * TEST
     */
    Json test(1: Struct1 s1, 2: Struct2 s2)
      throws (1: Exception1 user_exception, 2: Exception2 system_exception)
}

service ExtendedService extends Service1 {
    bool pong()
}

service ExternalExtends extends external.Service1 {
    bool pong()
}