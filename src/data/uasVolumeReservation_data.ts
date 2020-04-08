import { UASVolumeReservation, UASVolumeReservationCause, UASVolumeReservationPermitedUas, UASVolumeReservationRequiredSupport, UASVolumeReservationType } from "../entities/UASVolumeReservation";
import { deepCopy } from "../utils/entitiesUtils";


export let uasVolumeReservationList = []

let uasVolumeReservation = new UASVolumeReservation()
uasVolumeReservation.geography = { "type": "Polygon", "coordinates": [ [ [ -56.163482666015625, -34.910710205494524 ], [ -56.17043495178223, -34.91324402708751 ], [ -56.17009162902832, -34.91500357940347 ], [ -56.16305351257324, -34.914581290287316 ], [ -56.163482666015625, -34.910710205494524 ] ] ]}
uasVolumeReservation.cause = UASVolumeReservationCause.MUNICIPALITY
uasVolumeReservation.type = UASVolumeReservationType.DYNAMIC_RESTRICTION
uasVolumeReservation.effective_time_begin = "2019-12-11T19:59:10Z"
uasVolumeReservation.effective_time_end = "2019-12-11T20:59:10Z"

uasVolumeReservation.min_altitude = 20
uasVolumeReservation.max_altitude = 50
uasVolumeReservation.permitted_uas = []
uasVolumeReservation.permitted_uas.push( UASVolumeReservationPermitedUas.PART_107)
uasVolumeReservation.reason = "uasVolumeReservation.REASON"
uasVolumeReservation.required_support = []
uasVolumeReservation.required_support.push(UASVolumeReservationRequiredSupport.ENHANCED_SAFE_LANDING)

uasVolumeReservationList.push(deepCopy(uasVolumeReservation))

uasVolumeReservation.geography = {"type": "Polygon","coordinates": [[[-56.16416931152344,-34.901841214080186],[-56.16777420043943,-34.90592388467209],[-56.167430877685526,-34.907683593878055],[-56.1635684967041,-34.909724809310575],[-56.16416931152344,-34.901841214080186]]]}
uasVolumeReservation.cause = UASVolumeReservationCause.SECURITY
uasVolumeReservation.permitted_uas.push( UASVolumeReservationPermitedUas.RADIO_LINE_OF_SIGHT)
uasVolumeReservation.type = UASVolumeReservationType.STATIC_ADVISORY

uasVolumeReservation.effective_time_begin = "2020-02-18T16:05:16Z"
uasVolumeReservation.effective_time_end =   "2020-02-18T22:59:10Z"

uasVolumeReservationList.push(deepCopy(uasVolumeReservation))

// console.log(JSON.stringify(uasVolumeReservationList, null, 1))
