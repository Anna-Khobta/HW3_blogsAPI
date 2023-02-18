import {blogsCollection, BlogType} from "./db";


// const __products: ProductType[] = [{id: 1, title: 'tomato'}, {id: 2, title: 'orange'}]

//export let blogs: BlogType[] = []

export const blogsRepository = {
    async findBlogs(title: string | null | undefined): Promise<BlogType[]> {

        const filter: any = {}

        if (title) {
            filter.title = {$regex: title}
        }

        return blogsCollection.find((filter),{projection:{_id:0}}).toArray()
    },


    async findBlogById(id: string): Promise<BlogType | null> {
        let blog: BlogType | null = await blogsCollection.findOne({id: id},{projection:{_id:0}})
        if (blog) {
            return blog
        } else {
            return null
        }
    },



    async createBlog(name: string,
                         description: string, websiteUrl: string): Promise<BlogType> {
        const newBlog= {
            id: (+(new Date())).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: (new Date()).toISOString(),
            isMembership: false
        }

        const result = await blogsCollection.insertOne(newBlog)

        return newBlog
    },


    async updateBlog(id: string, name: string, description: string, websiteUrl: string ): Promise<boolean> {

        const result = await blogsCollection.updateOne({id: id}, {$set: {name: name, description:description, websiteUrl:websiteUrl  }})
        return result.matchedCount === 1
        // если совпал 1, то обвновился 1

    },


    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
        // если 1 сработало. если 0, то нет
    },


    async deleteAllBlogs(): Promise<boolean> {
        const result = await blogsCollection.deleteMany({})
        return result.acknowledged === true
        // если всё удалит, вернет true
    }
}



