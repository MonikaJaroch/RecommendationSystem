import pandas as pd
import numpy as np
import surprise

from surprise import BaselineOnly, SVDpp, SlopeOne, NMF, NormalPredictor, KNNBaseline, KNNBasic, KNNWithMeans, \
    KNNWithZScore, CoClustering
from surprise import Dataset
from surprise import Reader
from surprise.model_selection import GridSearchCV, cross_validate
from surprise import SVD
from surprise import accuracy
from surprise.model_selection import KFold
from collections import defaultdict


class RecommendationEngineSVD:

    def create_reader(self, dataset):
        dataset1 = dataset[['reviewer_id', 'listing_id', 'rating']]

        reader = Reader(rating_scale=(1,5))
        data = Dataset.load_from_df(dataset1[['reviewer_id', 'listing_id', 'rating']], reader)
        return data

    def tune_model(self, dataset):
        # Finding best parameter combination yields the best result using GridSearchCV
        data = self.create_reader(dataset)
        param_grid = {'random_state': [2], 'n_epochs': [5, 10], 'lr_all': [0.002, 0.005, 0.1],
                      'reg_all': [0.4, 0.6], 'n_factors': [100, 500]}
        grid_search = GridSearchCV(SVD, param_grid, measures=['rmse', 'mae'], cv=KFold(3, random_state=2))
        grid_search.fit(data)
        print('best RMSE score')
        print(grid_search.best_score['rmse'])

        print('combination of parameters that gave the best RMSE score')
        print(grid_search.best_params['rmse'])
        algo = grid_search.best_estimator['rmse']

        return algo
    def evaluate_model(self, data, algo):

        raw_ratings = data.raw_ratings

        # A = 90% of the data, B = 10% of the data
        threshold = int(.9 * len(raw_ratings))
        A_raw_ratings = raw_ratings[:threshold]
        B_raw_ratings = raw_ratings[threshold:]

        data.raw_ratings = A_raw_ratings  # train data
        # retrain on the whole set A
        trainset = data.build_full_trainset()
        algo.fit(trainset)

        # Compute biased accuracy on A
        testset = trainset.build_testset()
        predictions = algo.test(testset)
        print('Biased accuracy on A,', end='   ')
        accuracy.rmse(predictions, verbose=True)
        accuracy.mae(predictions, verbose=True)
        print('len(predictions)')
        print(len(predictions))

        # Compute unbiased accuracy on B
        testset = data.construct_testset(B_raw_ratings)  # testset is now the set B
        predictions = algo.test(testset)
        print('Unbiased accuracy on B,', end=' ')
        accuracy.rmse(predictions, verbose=True)
        accuracy.mae(predictions, verbose=True)
        print('len(predictions)')
        print(len(predictions))

    def cross_validation(self, data, algo):
        # define a cross-validation iterator
        kf = KFold(n_splits=7, random_state=2)

        for trainset, testset in kf.split(data):
            # train and test algorithm.
            algo.fit(trainset)

            predictions = algo.test(testset)

            # Compute and print Root Mean Squared Error
            accuracy.rmse(predictions, verbose=True)

    def prediction(self, data, algo):


        trainset = data.build_full_trainset()
        algo.fit(trainset)

        testset = trainset.build_anti_testset()
        predictionsAll = algo.test(testset)
        print('Accuracy on whole data set,', end='   ')
        accuracy.rmse(predictionsAll, verbose=True)
        print('len(predictions)')
        print(len(predictionsAll))

        return  predictionsAll

    def get_top3_recommendations(self,data, algo, topN=3): # dict_items([(253321, [(26604063, 4.982795800119139), (7480520, 4.975807392581182), (13769545, 4.9721587943058525)]), (19...
        predictions = self.prediction(data,algo)
        top3_recommendations = defaultdict(list)
        for uid, iid, true_r, est, _ in predictions:
            top3_recommendations[uid].append((iid, est))

        for uid, user_ratings in top3_recommendations.items():
            user_ratings.sort(key=lambda x: x[1], reverse=True)
            top3_recommendations[uid] = user_ratings[:topN]

        return top3_recommendations

    def save_recommendation_to_dataframe(self, top3_recommendations):
        dfo = pd.DataFrame(columns=['UserId', 'Recommended Listing,Rating'])
        i = 0;
        for uid, user_ratings in top3_recommendations.items():
            row = [uid, top3_recommendations[uid]]
            dfo.loc[i] = row
            i = i + 1
        return dfo

