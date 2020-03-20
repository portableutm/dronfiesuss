

let fakeDate = new Date("2019-12-11T13:59:10.000Z")

export function getNow() {
    // return Date.now();

    return new Date();

    // return fakeDate
}

export function fakeTime(newDate:string) : Date{
     fakeDate = new Date(newDate)
     return fakeDate
}