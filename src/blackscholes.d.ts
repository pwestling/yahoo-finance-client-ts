declare module "blackscholes" {
  
  export class BSHolder{
    constructor(underlyingPrice: number,
                strike: number,
                interest: number,
                vola: number,
                term: number,
                type: "call" | "put"
    );
  }

  export namespace BS {
    function bsPrice(bs: BSHolder): number;
    function delta(bs: BSHolder): number;
    function gamma(bs: BSHolder): number;
    function vega(bs: BSHolder): number;
    function theta(bs: BSHolder): number;
    function rho(bs: BSHolder): number;
  }
}
