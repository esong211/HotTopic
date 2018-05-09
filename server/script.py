'''
https://www.analyticsvidhya.com/blog/2016/08/beginners-guide-to-topic-modeling-in-python/
LDA Modeling refer to the above link.
'''
import sys
from urllib import request

import tweepy as tw
from nltk.corpus import stopwords
from nltk.stem.wordnet import WordNetLemmatizer
import string
import gensim
import json
from gensim import corpora
from textblob import TextBlob
from nltk.util import ngrams


from tweepy import Stream
import nltk

nltk.download('wordnet', quiet=True)

def twitter_api(geocode):
    count = 0
    tags = ''
    result_count = 0
    num_results = 400
    cur_id = None
    #l = StdOutListener()
    while result_count < num_results:
        tokens = []
        #get twitter credential
        with open("./twitter.cred", 'r') as fin:
            for line in fin:
                if line[0] != '#': # Not a comment line
                    tokens.append(line.rstrip('\n'))

        auth = tw.OAuthHandler(tokens[2], tokens[3])
        auth.set_access_token(tokens[0], tokens[1])
        api = tw.API(auth, wait_on_rate_limit=True)
        #stream = Stream(auth, l)
        result = tw.Cursor(api.search,q='-filter:retweets', geocode= geocode+',5km', lang = "en").items(100)
        tweets = []

        for i in result:
            count += 1
            #print(count)
            text = "".join(i for i in i.text if i in string.printable)
            tweets.append(text)
            cur_id = i.id
            result_count += 1
            #print(i.text)
        for tweet in tweets:
            tag_list = []
            for tag in tweet.split():
                if not tag.startswith('https') and not tag.startswith('@') and not tag.startswith('&'):
                    if tag.startswith('#'):
                        tag_list.append(tag.lstrip('#').lower())
                    elif tag.endswith('?'):
                        tag_list.append(tag.rstrip('?').lower())
                    else:
                        tag_list.append(tag)
            for tag in tag_list:
                tags += tag + ' '

    return tags


def clean(doc, stop_words, exclude):
    stop_free = " ".join([i for i in doc.lower().split() if i not in stop_words])
    #print('stop free is')
    #print(stop_free)
    punc_free = ''.join(ch for ch in stop_free if ch not in exclude)
    blob = TextBlob(punc_free)
    normalized = " ".join(lemma.lemmatize(word) for word in blob.split())
    return normalized

lat = sys.argv[1]
long = sys.argv[2]
stop_words = set(word.strip() for word in open("./lemur-stopwords.txt").readlines())
#print(stop_words)
exclude = set(string.punctuation)
lemma = WordNetLemmatizer()
geocode = lat + "," +long
#geocode = "37.776029,-122.409678"
doc = twitter_api(geocode)
#print(doc)
doc_clean = [clean(doc, stop_words, exclude).split()]
#print(doc_clean)
dictionary = corpora.Dictionary(doc_clean)
doc_term_matrix = [dictionary.doc2bow(_doc) for _doc in doc_clean]
Lda = gensim.models.ldamodel.LdaModel
ldamodel = Lda(doc_term_matrix, num_topics=1, id2word=dictionary, passes=50)
result = ldamodel.print_topics(num_topics=1, num_words=3)
tokens = []

#get twitter credential
with open("./twitter.cred", 'r') as fin:
    for line in fin:
        if line[0] != '#': # Not a comment line
            tokens.append(line.rstrip('\n'))

auth = tw.OAuthHandler(tokens[2], tokens[3])
auth.set_access_token(tokens[0], tokens[1])
api = tw.API(auth, wait_on_rate_limit=True)
result_arr = []
for i, topic in result:
    words = topic.split("+")
    temp = ""
    for subwords in words:
        act_word = subwords.split("*")[1]
        temp += (act_word + " ")
    result_arr.append(temp)
#print(result_arr)

words = result_arr[0].split()
tweets = []
for word in words:
    for tweet in tw.Cursor(api.search, q=word + '-filter:retweets', geocode=geocode+',5km', return_type = "popular", lang = "en")\
            .items(2):
        tweets.append(tweet.text)


dict = {}
dict = {"topic" : tweets}
data = json.dumps(dict)
print(data)

# with open("result.json", "w+") as f:
#     f.write(data)