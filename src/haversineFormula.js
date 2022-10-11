Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}

export function haversineForm(lat1, long1, lat2, long2){
    const n1 = ((lat2-lat1)/2).toRad()
    const n2 = ((long2-long1)/2).toRad()
    const lat1Rad = lat1.toRad()
    const lat2Rad = lat2.toRad()
    const inSqrt = Math.pow(Math.sin(n1), 2) + (Math.cos(lat1Rad)*Math.cos(lat2Rad)*(Math.pow(Math.sin(n2), 2)))
    const distance = 2*6335.439*Math.asin(Math.sqrt(inSqrt))
    return distance
}
console.log(haversineForm(-23.6831329, -46.6626276, -23.6912757, -46.6575686))