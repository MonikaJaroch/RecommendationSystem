from flask import Flask, jsonify,request, Response
from flask_cors import CORS
from RecommendationEngineALS import RecommendationEngineALS
from RecommendationEngineSVD import RecommendationEngineSVD
from DatabaseCommunication import DatabaseCommunication
from CleaningReview import CleaningReview
from SentimentalAnalysis import SentimentalAnalysis
from RatingGenerator import RatingGenerator

app = Flask("__name__")
CORS(app)
database_communication = DatabaseCommunication()
cleaningReview = CleaningReview()
sentimentalAnalysis = SentimentalAnalysis()
ratingGenerator = RatingGenerator()
recommendSVD = RecommendationEngineSVD()

@app.route('/')
def home():
    return "WItaj"

@app.route('/userPanel/hotelsList', methods=['GET'])
def getHotelList():
    print(33333)
    listings = database_communication.get_all_from_collection('recommendation_system','listings')
    result = []

    for field in listings:
        result.append(
            {'listing_id': field['listing_id'], 'picture_url': str(field['picture_url']), 'name': str(field['name']),
             'neighbourhood': str(field['neighbourhood']), 'property_type': str(field['property_type']), 'room_type': str(field['room_type']),
             'accommodates': field['accommodates'], 'price': str(field['price'])})
    return jsonify(result)
@app.route('/userPanel/hotelsList', methods=['POST'])
def addHotelToReview():
    print(44444)
    json_result = request.get_json()
    database_communication.add_to_collection('recommendation_system','waitingForReview', json_result)
    return Response(status=201, mimetype='application/json')
@app.route('/userPanel/waitingToReview/<int:userId>', methods=['GET'])
def getHotelToReview(userId):
    print(111111)
    hotelToReview = database_communication.get_from_collection_byID('recommendation_system','waitingForReview',userId)
    result = []

    for field in hotelToReview:
        result.append(
            {
                'listing_id': field['hotel_id'], 'picture_url': str(field['picture_url']), 'name': str(field['name'])
            }
        )
    return jsonify(result)
@app.route('/userPanel/waitingToReview/<int:userId>/<int:hotelId>', methods=['DELETE'])
def deleteReviewedHotel(userId,hotelId):
    print(22222)
    hotelToDelete = database_communication.get_collection('recommendation_system','waitingForReview')
    response = hotelToDelete.delete_one({'reviewer_id':userId, 'hotel_id':hotelId})
    if response.deleted_count == 1:
        return Response(status=204, mimetype='application/json')
    else:
        return Response(status=404, mimetype='application/json')

@app.route('/userPanel/waitingToReview', methods=['POST'])
def addReviewedHotel():
    print(555555)
    json_result = request.get_json()
    review = json_result['review']
    hotelID = json_result['hotel_id']
    userID = json_result['reviewer_id']
    data = [[hotelID, userID, review]]
    #generate rating and add to review collection
    clean = cleaningReview.clean_dataset(data)
    output = sentimentalAnalysis.sentimental_analysis((clean))
    rating = ratingGenerator.generate_rating(output, clean)
    database_communication.add_dataframe_to_collection('reviews', 'recommendation_system', rating)

    return Response(status=204, mimetype='application/json')
@app.route('/userPanel/waitingToReview/ALS', methods=['POST'])
def ALSRecommendation():

    # recommendation by ALS engine
    recommendation = RecommendationEngineALS()
    value = recommendation.get_top3_recommendations()
    database_communication.mongo_import_from_dataframe('recommendation_system','RecommendationALS',value)

    return Response(status=201, mimetype='application/json')
@app.route('/userPanel/waitingToReview/SVD', methods=['POST'])
def SVDRecommendation():
    #recommendation by SVD engine
    dataset = database_communication.import_to_dataframe('recommendation_system', 'reviews')
    data = recommendSVD.create_reader(dataset)
    algo = recommendSVD.tune_model(dataset)

    top3 = recommendSVD.get_top3_recommendations(data, algo)
    df = recommendSVD.save_recommendation_to_dataframe(top3)
    database_communication.mongo_import_from_dataframe('recommendation_system', 'RecommendationSVD',df)

    return Response(status=201, mimetype='application/json')

@app.route('/userPanel/<int:userId>', methods=['GET'])
def getRecentlyVisited(userId):

    recentlyVisited = database_communication.get_recently_visited_by_user(userId)
    result = []

    for field in recentlyVisited:
        result.append(
            {
                'listing_id': field['listing_id'], 'picture_url': str(field['picture_url']), 'name': str(field['name']),
                'neighbourhood': str(field['neighbourhood']), 'property_type': str(field['property_type']),
                'room_type': str(field['room_type']),'accommodates': field['accommodates'], 'price': str(field['price']),
                'rating': field['rating']

            }
        )
    return jsonify(result)
@app.route('/userPanel/recommendation/<int:userId>', methods=['GET'])
def getRecommendationSVD(userId):
    recommendationSVD = database_communication.get_user_recommendationSVD_from_collection(userId)
    result = []

    for field in recommendationSVD:
        result.append(
            {
                'listing_id': field['listing_id'], 'picture_url': str(field['picture_url']), 'name': str(field['name']),
                'neighbourhood': str(field['neighbourhood']), 'room_type': str(field['room_type']), 'accommodates': field['accommodates'],
                'price': str(field['price']),'rating': field['rating']

            }
        )
    return jsonify(result)
@app.route('/userPanel/recommendation/ALS/<int:userId>', methods=['GET'])
def getRecommendationALS(userId):
    recommendationALS = database_communication.get_user_recommendationALS_from_collection(userId)
    result = []

    for field in recommendationALS:
        result.append(
            {
                'listing_id': field['listing_id'], 'picture_url': str(field['picture_url']), 'name': str(field['name']),
                'neighbourhood': str(field['neighbourhood']), 'room_type': str(field['room_type']), 'accommodates': field['accommodates'],
                'price': str(field['price']),'rating': field['rating']

            }
        )
    return jsonify(result)
@app.route('/userPanel/dashboard', methods=['GET'])
def getRoomType():
    roomType = database_communication.get_number_of_room_type('listings')
    result = []

    for field in roomType:
        result.append(
            {'_id': str(field['_id']), 'count': field['count']})
    return jsonify(result)
@app.route('/userPanel/dashboard/neighbourhood', methods=['GET'])
def getNeigbourPrice():
    neigbourPrice = database_communication.get_neighbourhood_price('listings')
    result = []

    for field in neigbourPrice:
        result.append(
            {'_id': str(field['_id']), 'price': field['price']})
    return jsonify(result)
if __name__ == '__main__':
    app.run()