class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    const queryObj = {...this.queryString}; // make a copy of the query
    const excludedFields = ['page', 'sort', 'limit', 'fields']

    // Remove these fields from the queryObj
    excludedFields.forEach(el=>{
      delete queryObj[el]
    })

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // 2) SORTING
  sort () {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate () {
    const page = this.queryString.page * 1 || 1 // convert string to number. Default value as 1.
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page -1) * limit; // skip 20 results if on page 3
    console.log(`page: ${page}, limit: ${limit}, skip: ${skip}`);
    // 127.0.0.1:3000/api/v1/tours/?page=2&limit=10
    // 1-10 for page 1, 11-20 for page 2, 21-30 for page 3
    // page 2 means skip 10
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
