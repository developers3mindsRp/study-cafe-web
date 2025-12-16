declare module "country-list" {
  interface Country {
    name: string;
    code: string;
  }

  const countryList: {
    getNames(): string[];
    getCodes(): string[];
    getData(): Country[];
    getName(code: string): string | undefined;
    getCode(name: string): string | undefined;
  };

  export default countryList;
}
