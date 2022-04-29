import requests
import json
import os, sys

HUE_EXTERNAL_API = "https://discovery.meethue.com"

hue_internal_api = "http://{0}/api/"
hue_bridge_ip = ""

# Get the bridge IP address from the Hue service
data = requests.get(HUE_EXTERNAL_API).json()
hue_bridge_ip = data[0]["internalipaddress"]
print("Hue Bridge IP: {0}".format(hue_bridge_ip))

# create a user on the bridge that can be used to control hue
hue_internal_api = hue_internal_api.format(hue_bridge_ip)
payload = {"devicetype": "ticket_the_world"}
data = requests.post(hue_internal_api, json=payload)
response_dict = json.loads(data.text)

if response_dict == []:
    print("No bridges found")
    exit()
elif "error" in response_dict[0]:
    print("Error: {0}".format(response_dict[0]["error"]["description"]))
    exit()
else:
    print("Hue account has been created. Username: {0}".format(response_dict[0]["success"]["username"]))

    config = {"bridge": hue_bridge_ip, "username": response_dict[0]["success"]["username"]}

    # write to settings config file
    myFile = open(os.path.dirname(sys.argv[0]) + "/config.json", "w")
    json.dump(config, myFile)
    myFile.close()

exit()
