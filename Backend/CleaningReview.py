import pandas as pd
import string
import nltk
import re

from nltk import pos_tag
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet

nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
nltk.download('crubadan')


class CleaningReview:


    def clean_dataset(self, data):
        dataset = self.save_new_record_to_dataframe(data)
        dataset['comments_clean'] = dataset['comments'].apply(self.transform_text)
        # print(dataset['comments_clean'].head())
        # dataset.dropna(inplace=True) # drop missing values
        # dataset.reset_index(drop=True)
        return dataset

    def save_new_record_to_dataframe(self, data):        # data example: data = [[1018, 1779, 'Great place!']]
        dataset = pd.DataFrame(data, columns=['listing_id', 'reviewer_id', 'comments'])
        dataset['comments'].astype(str)
        return dataset
    def reduce_dataset_size(self, dataset):
        counts = dataset['listing_id'].value_counts()
        dataset = dataset[dataset['listing_id'].isin(counts[counts >= 10].index)]
        dataset.info()
        counts1 = dataset['reviewer_id'].value_counts()
        # print(counts1)
        dataset = dataset[dataset['reviewer_id'].isin(counts1[counts1 > 3].index)]
        dataset.info()
        dataset.reset_index(inplace=True, drop=True)
        return dataset

    def get_wordnet_pos(self, pos_tag):
        if pos_tag.startswith('J'):
            return wordnet.ADJ
        elif pos_tag.startswith('V'):
            return wordnet.VERB
        elif pos_tag.startswith('N'):
            return wordnet.NOUN
        elif pos_tag.startswith('R'):
            return wordnet.ADV
        else:
            return wordnet.NOUN

    def remove_emoji(self, text):
        emoji_pattern = re.compile("["
                                   u"\U0001F600-\U0001F64F"  # emoticons
                                   u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                                   u"\U0001F680-\U0001F6FF"  # transport & map symbols
                                   u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                                   u"\U00002702-\U000027B0"
                                   # u"\U000024C2-\U0001F251"
                                   "]+", flags=re.UNICODE)
        return emoji_pattern.sub(r'', text)

    def transform_text(self, text):
        # converting to lower text
        text = text.lower()
        # tokenization and removing punctuations
        text = [word.strip(string.punctuation) for word in text.split(" ")]
        # removing words that have numbers in them
        text = [word for word in text if not any(c.isdigit() for c in word)]
        # removing stop words
        stop = stopwords.words('english')
        text = [x for x in text if x not in stop]
        # removing empty tokens
        text = [t for t in text if len(t) > 0]
        # pos tagging
        pos_tags = pos_tag(text)
        # lemmatization
        text = [WordNetLemmatizer().lemmatize(t[0], self.get_wordnet_pos(t[1])) for t in pos_tags]
        # removing 1 letter words
        text = [t for t in text if len(t) > 1]
        # join all
        text = " ".join(text)
        # remove emoji
        text = self.remove_emoji(text)
        return (text)




