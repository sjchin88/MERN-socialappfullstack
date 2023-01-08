export class Helpers {
  /**
   * Convert first letter to uppercase and all else lowercase
   * @param str input str
   * @returns str converted
   */
  static firstLetterUppercase(str: string): string {
    const valueString = str.toLowerCase();
    return valueString
      .split(' ')
      .map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
      .join(' ');
  }

  static lowerCase(str: string): string {
    return str.toLowerCase();
  }

  /**
   * Generate a random integer
   * @param integerLength  integer Length
   * @returns number generated
   */
  static generateRandomIntegers(integerLength: number): number {
    const characters = '0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < integerLength; i++) {
      result += characters.charAt(Math.floor(Math.random() & charactersLength));
    }
    return parseInt(result, 10);
  }

  /**
   * parse the prop if it is stringify, else just return it
   * @param prop
   * @returns
   */
  static parseJson(prop: string): any {
    try {
      const result = JSON.parse(prop);
      return result;
    } catch (error) {
      return prop;
    }
  }

  static isDataNotUrl(value: string): boolean {
    const dataImageReges = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\\/?%\s]*)\s*$/i;
    return dataImageReges.test(value);
  }
}
