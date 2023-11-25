import { Query } from 'mongoose';

interface QueryString {
    search?: string;
    sort?: string;
    fields?: string;
    page?: number;
    limit?: number;
    user?: string;
    category?: string;
}

class Features<T> {
    query: Query<T[], T>;
    queryStr: QueryString;

    constructor(query: Query<T[], T>, queryStr: QueryString) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search(index: number): this {
        const searchStr = this.queryStr.search || '';

        const searchComponents = searchStr.split(' ');
        searchComponents.forEach(item => {
            regexArr.push(new RegExp(item, 'i'));
        });

        const regexArr = [];

        regexArr.push(new RegExp(searchStr, 'i'));
        regexArr.push(new RegExp(searchStr.replace(' ', ''), 'i'));

        const search = this.queryStr.search
            ? index === 0
                ? {
                      $or: [
                          // for users
                          { username: { $in: regexArr } },
                          { name: { $in: regexArr } },
                      ],
                  }
                : index === 1
                ? {
                      $or: [
                          // for exhibitions
                          { title: { $in: regexArr } },
                          { category: { $in: regexArr } },
                      ],
                  }
                : {}
            : {};

        this.query = this.query.find(search);
        return this;
    }

    filter(): this {
        const queryObj = { ...this.queryStr };

        if (queryObj.user) {
            this.query = this.query.find({ userID: queryObj.user });
            delete queryObj.user;
        }

        if (queryObj.category) {
            this.query = this.query.find({ category: queryObj.category });
            delete queryObj.category;
        }

        const excludeFields = ['page', 'sort', 'limit', 'fields', 'user', 'category'];
        excludeFields.forEach(item => delete queryObj[item]);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    sort(): this {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.replace(',', ' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('createdAt');
        }
        return this;
    }

    fields(): this {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.replace(',', ' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginator(): this {
        const page = this.queryStr.page ?? 1;
        const limit = this.queryStr.limit ?? 10;

        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

export default Features;
