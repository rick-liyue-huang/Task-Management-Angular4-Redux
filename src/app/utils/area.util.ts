

import {city_data} from './area.data';

export const getprovinces = () => {
    const provinces = [];
    // turn the object to array
    for (var province in city_data) {
        provinces.push(province);
    }
    return provinces;
}

// get the cities array from object
export const getCitiesByProvince = (province: string) => {

    if (!province || !city_data[province]) {
        return [];
    }

    const cities = [];
    const val = city_data[province];
    for (const city in val) {
        cities.push(city);
    }
    return cities;
}

// get the district form province and city object
export const getDistrictByProvinceAndCity = (province: string, city: string) => {
    if (!province || !city_data[province] || !city_data[province][city]) {
        return [];
    }
    // get the data under 2-d array
    return city_data[province][city];
}


