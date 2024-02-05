### Bfx Challenge

The following is the proposed code for the distributed exchange bfx challenge. 

Requirements completion: 

* Code in Javascript [✅ ]
* Use Grenache for communication between nodes [✅ ]
* Simple order matching engine [✅ ]

If you don't get to the end, just write up what is missing for a complete implementation of the task. Also, if your implementation has limitation and issues, that's no big deal. Just write everything down and indicate how you could solve them, given there was more time.


# Run the project 

### Setting up the DHT

```
npm i -g grenache-grape
```

```
# boot two grape servers

grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

### Setting up Grenache in your project

```
npm install
```


On one terminal: 

```
node server.js
```

And on a different terminal

```
node client.js
```


# Comments / Misc / Improvements:

While trying to implement everything under the provided time window, I've tried to focus tasks in the following order =>

1) Implement basic structure of the project
2) Model the Orderbook class and add tests for basic functionalities
3) Once the orderbook was properly working with bare minimum requirements, add more complex logic and refactor (locking mechanism, broader trade matching algorithm)
4) Implement local client orderbook instance 
5) Implement broadcasting and global sync with different orderbooks
6) Add misc and improvements if time doable

Regarding `5` onwards, time was the main constrain I was dealing with. Resulting in errors while trying to sync orderbooks instances, and grape lib discovery I think. This results in an outdated or error version from the local orderbook and the network desired one. Failing to accomplish the last task. 

As per `6`, I'd probably broaden the locking mechanism (something like mutex-async), add more tests for different edge cases. Also, for miscellaneous things, I'd use typescript if possible to minimize unexpected errors.

For *dev improvements*, the last couple of lines from client.js where the main trigger for testing the client side, while adding or removing variations of different kind of orders. I'd extract this logic to either a script or something like a CLI to make development easier.