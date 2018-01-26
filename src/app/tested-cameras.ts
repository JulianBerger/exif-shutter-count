export class Brand {
  public name: string;      // Brand Name
  public exifName: string;  // Brand Name in Exif Files
  public cameras: Camera[] = []; // Array of Cameras from that Brand

  constructor(name: string, exifName: string) {
    this.name = name;
    this.exifName = exifName;
  }

  public addCamera(cam: Camera): void {
    this.cameras.push(cam);
  }
}

export class Camera {
  public name: string; // Camera Name
  public exifName: string;  // Camera Name in Exif Files

  constructor(name: string, exifName) {
    this.name = name;
    this.exifName = exifName;
  }
}

export class TestedCameras {
  public brands: Brand[] = []; // Array of Brands which holds Brand-name + Cameras

  constructor() {
  }

  public addBrand(brand: Brand): void {
    this.brands.push(brand);
  }

  public getBrandByName(name: string): Brand {
    const brand = this.brands.filter(brand => brand.name === name);
    if (brand.length) {
      console.log(brand);
      return <Brand>brand[0];
    } else {
      return undefined;
    }
  }
}

// CANON
const canon = new Brand('Canon', 'Canon');
canon.addCamera(new Camera('EOS 1D', '1D'));
canon.addCamera(new Camera('EOS 5D', '5D'));
canon.addCamera(new Camera('EOS 60D', '60D'));

// NIKON
const nikon = new Brand('Nikon', 'Nikon');
nikon.addCamera(new Camera('1', '1'));
nikon.addCamera(new Camera('D750', 'D750'));
nikon.addCamera(new Camera('D800', 'D800'));
nikon.addCamera(new Camera('D3X00', 'D3x00'));
nikon.addCamera(new Camera('D3/D4/D5', 'D3D4D5'));

// SONY
const sony = new Brand('Sony', 'Sony');
sony.addCamera(new Camera('Alpha 7 (R/S)', 'ILCE-7'));
sony.addCamera(new Camera('Alpha 7 II (R/S)', 'ILCE-7II'));
sony.addCamera(new Camera('Alpha 7 III', 'ILCE-7III'));
sony.addCamera(new Camera('Alpha 9', 'ILCE-9'));
sony.addCamera(new Camera('Alpha 6000-6500', 'A6x00'));


// PENTAX
const pentax = new Brand('Pentax', 'Pentax');
pentax.addCamera(new Camera('645D', '645D'));
pentax.addCamera(new Camera('K200D', 'k200d'));
pentax.addCamera(new Camera('K5', 'k5'));
pentax.addCamera(new Camera('K1', 'k1'));


// FUJIFILM
const fuji = new Brand('Fuji', 'Fujifilm');


export let testedCameras = new TestedCameras();
testedCameras.addBrand(canon);
testedCameras.addBrand(nikon);
testedCameras.addBrand(sony);
testedCameras.addBrand(pentax);
testedCameras.addBrand(fuji);
