
import {GB2260} from './identity.data';

export const extractInfo = (idNo: string) => {

    // the first 6 digit is used for match address
    const addrPart = idNo.substring(0, 6);
    // from 6 to 13 to used for match birthdate
    const birthPart = idNo.substring(6, 14);

    return {
        addrCode: addrPart,
        dateOfBirth: birthPart
    }
}

export const isValidAddr = (addr: string) => {
    return GB2260[addr] !== undefined;
}

export const getAddrByCode = (code: string) => {

    // turn the code string to address object
    const province = GB2260[code.substring(0, 2) + '0000'];
    const city = GB2260[code.substring(0, 4) + '00'].replace(province, '');
    const district = GB2260[code].replace(province+city, '');

    return {
        province: province,
        city: city,
        district: district
    };
}