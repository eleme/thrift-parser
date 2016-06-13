namespace php hehe

/**
 * Types
 */
typedef string Json
typedef i64 Mobile

/**
 * Const
 */
const i16 C1 = 123
const string C2 = "456"
const list<i32> C3 = [ 1, 2, 3 ]
const map<i32, string> C3 = { 1: 'a', 2: 'b', 3: 'c' }

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
}

struct Struct2 {
    1: required int id,
    2: required Json field1,
    3: required Mobile field2,
    4: required i16 field3,
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
}

/**
 * Services
 */
service Service2 {
    /**
     * Base services
     */
    bool ping(),

    /**
     * TEST
     */
    Json test(1: Struct1 s1, 2: Struct2 s2)
      throws (1: Exception1 user_exception, 2: Exception2 system_exception)
}
