import requests
from requests.packages import urllib3
import json
import os, sys

# hue uses a self-signed certificate, so disable the warning
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

hue_internal_api = "https://{0}/clip/v2/resource/light"
hue_internal_ip = ""
username = ""
config = {}

try:
    myFile = open(os.path.dirname(sys.argv[0]) + "/config.json", "r")
    config = json.load(myFile)
    hue_internal_ip = config["bridge"]
    username = config["username"]
except:
    print("Config settings file not found.  Please run configure-user script.")
    exit()


# Get the bridge IP address from the Hue service
data = requests.get(hue_internal_api.format(hue_internal_ip), headers={"hue-application-key": username}, verify=False).json()

newjson = {}
for light in data["data"]:
    # add lights to the config
    config[light["id"]] = light["metadata"]["name"]

# write to settings config file
myFile = open(os.path.dirname(sys.argv[0]) + "/config.json", "w")
json.dump(config, myFile)
myFile.close()
