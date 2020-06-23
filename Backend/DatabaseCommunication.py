import pymongo
import json
import pandas as pd
import ast
from pandas import DataFrame


class DatabaseCommunication:

    def __init__(self):
        self.mongo = pymongo.MongoClient("mongodb+srv://Monika:Monika@learncluster-x6htx.mongodb.net/test?retryWrites=true&w=majority")

    def add_dataframe_to_collection(self, coll_name,db_name, data):
        """
        add pandas dataframe  to collection
        coll_name: collection name
        db_name: database name
        data: pandas dataframe
        """
        db = self.mongo[db_name]
        coll = db[coll_name]
        dataset = json.loads(data.to_json(orient='records'))
        coll.insert(dataset)
    def add_to_collection(self, db_name, coll_name,data):
        db = self.mongo[db_name]
        collection = db[coll_name]
        inserted = collection.insert_one(data)
        print(inserted.inserted_id)
    def mongo_import_from_csv(self,csv_path, db_name, coll_name):
        """ Imports a csv file at path csv_name to a mongo colection
        returns: count of the documants in the new collection
        """
        db = self.mongo[db_name]
        coll = db[coll_name]
        data = pd.read_csv(csv_path)
        # data.reset_index(inplace=True)
        payload = json.loads(data.to_json(orient='records'))
        coll.remove()
        coll.insert(payload)
        return coll.count()
    def import_to_dataframe(self, db_name, coll_name):
        """
        Import mongoDB to pandas dataframe without _id column
        db_name: database name
        coll_name: collection name
        return: pandas dataframe
        """
        db = self.mongo[db_name]
        coll = db[coll_name]
        df = DataFrame(list(coll.find()))
        df = df.drop('_id', 1)
        print(df.head())
        return df
    def mongo_import_from_dataframe(self, db_name, coll_name, data):
        db = self.mongo[db_name]
        coll = db[coll_name]
        dataset = json.loads(data.to_json(orient='records'))
        coll.remove()
        coll.insert(dataset)
        return coll.count()

    def get_all_from_collection(self,db_name, coll_name):
        db = self.mongo[db_name]
        collection = db[coll_name]
        return collection.find()

    def get_collection(self,db_name, coll_name):
        db = self.mongo[db_name]
        collection = db[coll_name]
        return collection
    def get_from_collection_byID(self,db_name, coll_name,id):
        db = self.mongo[db_name]
        coll = db[coll_name]
        review = coll.find({'reviewer_id': id})
        return review
    def get_recently_visited_by_user(self,id):
        db = self.mongo['recommendation_system']
        collection = db['reviews']
        reviewers = collection.find({'reviewer_id': id})
        recently_visited = []
        for document in reviewers:
            user_hotels = db['listings'].find({'listing_id': document['listing_id']})
            for item in user_hotels:
                item['rating'] = document['rating']
                recently_visited.append(item)
        return recently_visited
    def get_user_recommendationSVD_from_collection(self,id):
        db = self.mongo['recommendation_system']
        coll = db['RecommendationSVD']
        recommendations = coll.find({'UserId': id})
        recommendationList = []
        for item in recommendations:
            recommendationList = item['Recommended Listing,Rating']
        final_recommendation = []
        for field, value in recommendationList:
            listings = db['listings'].find({"listing_id": field})
            for item in listings:
                item['rating'] = value
                final_recommendation.append(item)
        return final_recommendation
    def get_user_recommendationALS_from_collection(self,id):
        db = self.mongo['recommendation_system']
        coll = db['RecommendationALS']
        reviewers = coll.find({'reviewer_id': id})
        doc = []
        for document in reviewers:
            doc = document['recommendations']
        final_recommendation = []
        for field, value in doc:
            listings = db['listings'].find({"listing_id": field})
            for item in listings:
                item['rating'] = value
                final_recommendation.append(item)
        return final_recommendation
    def get_number_of_room_type(self,coll_name):
        db = self.mongo['recommendation_system']
        coll = db[coll_name]

        room_type = coll.aggregate([{"$group": {"_id": "$room_type", "count": {"$sum": 1}}}])

        return room_type
    def get_neighbourhood_price(self,coll_name):
        db = self.mongo['recommendation_system']
        coll = db[coll_name]

        neighbourhood_price = coll.aggregate( [
        {
            "$group" :
            {
                "_id":"$neighbourhood",
                "price":{"$avg":"$price2"},
                "count":{"$sum":1}
            }
         },
         {
           "$match": {"count": {"$gte": 10}}
         }
        ]
       )
        return neighbourhood_price