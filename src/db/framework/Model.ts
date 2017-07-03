abstract class Model {

  constructor(data: any = {}) {
    for (let key in data) {
      this[key] = data[key];
    }
  }

}

export default Model;
