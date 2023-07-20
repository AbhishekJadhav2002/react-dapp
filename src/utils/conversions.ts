import { ethers } from "ethers";

/**
 * @param value value to be converted to Wei
 * @param decimal decimals of the token
 * @returns value in wei
 */
export const toWei = (value: string | number, decimals: number): string => {
    return ethers.utils.parseUnits(value.toString(), decimals).toString();
}