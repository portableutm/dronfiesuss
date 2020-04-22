let fakeDate = new Date("2019-12-11T13:59:10.000Z")

export function getNow() {

    return new Date();
}

export function fakeTime(newDate:string) : Date{
     fakeDate = new Date(newDate)
     return fakeDate
}