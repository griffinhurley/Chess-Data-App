# Chess.Com Data Analysis Web App built with React and Node. 

After a username is entered, displays bar chart of openings (https://en.wikipedia.org/wiki/Encyclopaedia_of_Chess_Openings) sorted on losses.

A pie chart of more specific game results (draw by repetition, insufficient material, stalemate etc.) is also displayed.

Both charts can be sorted by games where user was either black or white. 

## Landing Page:
![image](https://user-images.githubusercontent.com/62068680/82501802-b5985a80-9aaa-11ea-95db-f0327d02768e.png)
## After entering a username:
![image](https://user-images.githubusercontent.com/62068680/82501779-aca78900-9aaa-11ea-84aa-821f175ae568.png)
## Switching to Black Data:
![image](https://user-images.githubusercontent.com/62068680/82501822-bdf09580-9aaa-11ea-90d4-38f869cbc360.png)

All data is stored in a Postgres database so that future username lookups are much faster. 
