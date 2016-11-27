# Is this a game?

** Personal project to remind myself how to Google jQuery solutions. 

I'm using this format to find small jQuery solutions to use on other projects. Run functions on keyboard input. The UX involved with a character's health. I doubt I'll go into much detail but maybe I'll write comments in the js.

The actual gameplay portion of this game (that I don't really want you to play) involves crafting items from basic resources, surviving, and exploring. I swear I've never "played" Minecraft. If anything, I'm going to ripoff elements of <a href="http://www.kleientertainment.com/games/dont-starve" target="_blank">Don't Starve</a>. That game is great. 

Obviously since this is hosted here you can read the source files and hack the game. I'll save you the trouble. In the console, these are the resources needed to craft anything. Change the amount you have. Change the maximum amount you can carry. Write a function where the lava restores max health. I really don't care. 

```
var energy = 100;
var stick = 0;
var max_stick = 10;
var flint = 0;
var max_flint = 10;
```

### Known Issues

- Moving on and off a resource quickly will run the function multiple times, allowing you to collect more than the specified max amount of that resource. 
- Max amount of a resource is inconsistent. Sometimes it's correct; sometimes it's one more than the setting. 
- If your energy goes to 0, you have to make one more move to end the game.