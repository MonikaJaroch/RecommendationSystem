import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

class RatingGenerator:

    def join_dataframe(self, rating, dataset):
        rating_input_data = pd.concat([dataset, rating], axis=1)

        return rating_input_data

        # algorithm to compute the rating as per polarity score distribution and review comment analysis
    def draw_histograms_with_polarity(self, rating_input_data):
        plt.hist(rating_input_data['Negative'],bins=25,color='lightsteelblue')
        plt.ylabel('Ilość ocen')
        plt.xlabel('Wyniki negatywne Analizy Sentymentalnej')
        plt.savefig('/home/monia/mgrMoja/NewYork/Negative.png')
        plt.show()

        plt.hist(rating_input_data['Positive'],bins=25,color='lightsteelblue')
        plt.ylabel('Ilość ocen')
        plt.xlabel('Wyniki pozytywne Analizy Sentymentalnej')
        plt.savefig('/home/monia/mgrMoja/NewYork/Positive.png')
        plt.show()

        plt.hist(rating_input_data['Polarity'],bins=25,color='lightsteelblue')
        plt.ylabel('Ilość ocen')
        plt.xlabel('Ogólna polaryzacja ocen')
        plt.savefig('/home/monia/mgrMoja/NewYork/Polarity.png')
        plt.show()

    def compute_rating(self, pos, neg):
        rating = 0
        if pos > 30:
            rating = 5
        elif pos > 20:
            rating = 4
        elif pos > 10:
            rating = 3
        elif pos > 0:
            rating = 2

        penalty = 0
        if neg > 5 and neg <= 20:
            penalty = 1
        elif neg > 20 and neg <= 100:
            penalty = 2

        rating = rating - penalty
        if rating < 0:
            rating = 0
        return rating

    def predict_rating(self, df):
        rating_array = []
        for index, row in df.iterrows():
            rating = self.compute_rating(row['Positive'], row['Negative'])
            rating_array.append(rating)
        return rating_array

    def generate_rating(self, rating,dataset):
        rating_input_data = self.join_dataframe(rating,dataset)
        rating_array = self.predict_rating(rating_input_data)
        rating_array = np.array(rating_array)
        output_df = pd.DataFrame({
            'listing_id': rating_input_data['listing_id'],
            'reviewer_id': rating_input_data['reviewer_id'],
            'rating': rating_array,
        })
        return output_df
