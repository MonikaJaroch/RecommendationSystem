import pandas as pd
import numpy as np

import nltk
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from langdetect import detect
from nltk import pos_tag, WordNetLemmatizer
from nltk.corpus import stopwords
from textblob import TextBlob
nltk.download('vader_lexicon')

class SentimentalAnalysis:

    def read_dataset_from_csv(self, path):
        dataset = pd.read_csv(path)
        dataset.dropna(inplace=True)  # drop missing values
        dataset.reset_index(drop=True)
        return dataset

    def draw_word_cloud(self,dataset):
        text = " ".join(review for review in dataset['comments_clean'])
        print("There are {} words in the combination of all review.".format(len(text)))
        wordcloud = WordCloud(width=3000, height=2000, max_words=200, background_color="white").generate(text)
        plt.figure()
        plt.imshow(wordcloud, interpolation="bilinear")
        plt.axis("off")
        plt.show()
        wordcloud.to_file("/home/monia/mgrMoja/NewYork/first_review.png")

    def sentimental_analysis(self, dataset):

        positive_rating = []
        negitive_rating = []
        polarity = []

        for index, row in dataset['comments_clean'].iteritems():
            analyser = SentimentIntensityAnalyzer()
            result = analyser.polarity_scores(row)
            score = result['compound']
            positive_rating.append(result['pos'] * 100)
            negitive_rating.append(result['neg'] * 100)
            polarity.append(score)
        #
        positive_rating = np.array(positive_rating)
        negitive_rating = np.array(negitive_rating)
        polarity = np.array(polarity)

        output_df = pd.DataFrame({
            'Positive': positive_rating,
            'Negative': negitive_rating,
            'Polarity': polarity
        })

        return output_df

    @staticmethod
    def save_to_csv(dataset, path):
        dataset.to_csv(path, index=False)



