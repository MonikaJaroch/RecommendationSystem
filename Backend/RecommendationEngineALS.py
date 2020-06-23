from pyspark.sql import SparkSession
from pyspark.ml.recommendation import ALS, ALSModel
from pyspark.ml.tuning import CrossValidator, ParamGridBuilder
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.sql import SQLContext

class RecommendationEngineALS:


    def __init__(self):
        self.spark = SparkSession \
            .builder \
            .master("local") \
            .appName("Recommend") \
            .config('spark.mongodb.input.uri', 'mongodb+srv://Monika:Monika@learncluster-x6htx.mongodb.net/test?retryWrites=true&w=majority&authSource=admin') \
            .config('spark.jars.packages', 'org.mongodb.spark:mongo-spark-connector_2.11:2.4.1') \
            .getOrCreate()
        self.ratingDF = self.__load_to_df().select('reviewer_id','listing_id','rating')
        self.model = ALS(
            seed = 1,
            nonnegative=True,
            userCol="reviewer_id",
            itemCol="listing_id",
            ratingCol="rating",
            coldStartStrategy="drop")


    def __load_to_df(self):
        ratings_df = self.spark.read \
            .format("com.mongodb.spark.sql.DefaultSource") \
            .option("spark.mongodb.input.uri",
                    "mongodb+srv://Monika:Monika@learncluster-x6htx.mongodb.net/test?retryWrites=true&w=majority&authSource=admin") \
            .option("database", "recommendation_system") \
            .option("collection", "reviews") \
            .load()
        return ratings_df

    def tune_ALS(self, model, train_data, validation_data, maxIter, regParams, ranks):
        """
        grid search function to select the best model based on RMSE of
        validation data
        Parameters
        ----------
        model: spark ML model, ALS
        train_data: spark DF with columns ['reviewer_id', 'listing_id', 'rating']
        validation_data: spark DF with columns ['reviewer_id', 'listing_id', 'rating']
        maxIter: int, max number of learning iterations
        regParams: list of float, one dimension of hyper-param tuning grid
        ranks: list of float, one dimension of hyper-param tuning grid
        Return
        ------
        The best fitted ALS model with lowest RMSE score on validation data
        """
        # initial
        min_error = float('inf')
        best_rank = -1
        best_regularization = 0
        best_model = None
        for rank in ranks:
            for reg in regParams:
                # get ALS model
                als = model.setMaxIter(maxIter).setRank(rank).setRegParam(reg)

                # train ALS model
                model_f = als.fit(train_data)
                # evaluate the model by computing the RMSE on the validation data
                predictions = model_f.transform(validation_data)
                evaluator = RegressionEvaluator(metricName="rmse",
                                                labelCol="rating",
                                                predictionCol="prediction")
                rmse = evaluator.evaluate(predictions)
                print('{} latent factors and regularization = {}: '
                      'validation RMSE is {}'.format(rank, reg, rmse))
                if rmse < min_error:
                    min_error = rmse
                    best_rank = rank
                    best_regularization = reg
                    best_model = model_f
        print('\nThe best model has {} latent factors and '
              'regularization = {}'.format(best_rank, best_regularization))
        return best_model


    def tune_model(self, maxIter, regParams, ranks, split_ratio=[0.8, 0.1, 0.1]):
        """
        Hyperparameter tuning for ALS model
        Parameters
        ----------
        maxIter: int, max number of learning iterations
        regParams: list of float, regularization parameter
        ranks: list of float, number of latent factors
        split_ratio: tuple, (train, validation, test)
        """
        # split the data set between a training data set,validation and test set.
        (trainingData, validationData, testData) = self.ratingDF.randomSplit(split_ratio, seed=1)
        self.model = self.tune_ALS(self.model, trainingData, validationData, maxIter, regParams, ranks)

        prediction = self.model.transform(testData)
        evaluator = RegressionEvaluator(metricName="rmse", labelCol="rating", predictionCol="prediction")
        evaluator2 = RegressionEvaluator(metricName="mae", labelCol="rating", predictionCol="prediction")
        rmse = evaluator.evaluate(prediction)
        mae = evaluator2.evaluate(prediction)
        print('RMSE is %s' % rmse)
        print('MAE is %s' % mae)

    def get_top3_recommendations(self, maxIter = 12, regParam = [0.1, 0.2], ranks = [8, 12, 16]):

        self.tune_model(maxIter,regParam,ranks)

        userRecommendations = self.model.recommendForAllUsers(3).toPandas()

        return userRecommendations

