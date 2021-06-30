interface TransationDBDto { 
    sql: string,
    params:Array<any>,
}
interface TransationDBDtoTest{
    sql: string,
    params:Array<any>,
    auditTaskObj:Array<any>,
}