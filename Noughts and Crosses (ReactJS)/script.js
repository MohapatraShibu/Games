(function() {
  var EndGamePopOver, GameField, GameState, NewGameButton, TicTacToeCell, TicTacToeCellsMatrix, TitleLabel, div, gameState, h1;

  GameState = (function() {
    class GameState {
      constructor() {
        var x;
        this.gameField = (function() {
          var j, results;
          results = [];
          for (x = j = 0; j <= 8; x = ++j) {
            results.push(Math.pow(2, x));
          }
          return results;
        })();
      }

      currentSymbol() {
        if (this.isX) {
          return 'x';
        } else {
          return 'o';
        }
      }

      currentPlayer() {
        if (this.isX) {
          return this.playerX;
        } else {
          return this.playerO;
        }
      }

      checkWinConditions() {
        var j, len, number, ref;
        ref = this.winningNumbers;
        for (j = 0, len = ref.length; j < len; j++) {
          number = ref[j];
          if ((number & this.currentPlayer()) === number) {
            this.winner = `Player ${this.currentSymbol().toUpperCase()}`;
          }
        }
        if (this.moves > 8) {
          return this.winner = 'Nobody';
        }
      }

      updateCurrentSymbol() {
        return this.isX = !this.isX;
      }

      updateState(index) {
        if (this.isX) {
          this.playerX += this.gameField[index];
        } else {
          this.playerO += this.gameField[index];
        }
        this.moves++;
        this.checkWinConditions();
        return this.updateCurrentSymbol();
      }

      reset() {
        this.isX = true;
        this.playerX = 0;
        this.playerO = 0;
        this.moves = 0;
        return this.winner = null;
      }

    };

    GameState.prototype.isX = true;

    GameState.prototype.playerX = 0;

    GameState.prototype.playerO = 0;

    GameState.prototype.moves = 0;

    GameState.prototype.winner = null;

    GameState.prototype.gameField = null;

    GameState.prototype.winningNumbers = [7, 56, 448, 73, 146, 292, 273, 84];

    return GameState;

  }).call(this);

  gameState = new GameState;

  ({
    div,
    h1
  } = React.DOM);

  document.addEventListener('DOMContentLoaded', function() {
    return React.renderComponent(GameField(), document.body);
  });

  GameField = React.createClass({
    getInitialState: function() {
      return {
        gameIsBeingPlayed: false
      };
    },
    render: function() {
      return div({
        className: 'tic-tac-toe--field',
        children: [
          TicTacToeCellsMatrix({
            onClick: this.onCellClick,
            gameIsBeingPlayed: this.state.gameIsBeingPlayed
          }),
          EndGamePopOver({
            onNewGame: this.onNewGame,
            gameIsBeingPlayed: this.state.gameIsBeingPlayed
          })
        ]
      });
    },
    onNewGame: function() {
      gameState.reset();
      return this.setState({
        gameIsBeingPlayed: true
      });
    },
    onCellClick: function() {
      if (gameState.winner) {
        return this.setState({
          gameIsBeingPlayed: false
        });
      }
    }
  });

  TicTacToeCell = React.createClass({
    getInitialState: function() {
      return {
        symbol: null
      };
    },
    componentWillReceiveProps: function() {
      if (!this.props.gameIsBeingPlayed) {
        return this.setState({
          symbol: null
        });
      }
    },
    render: function() {
      return div({
        className: this.classes(),
        onMouseUp: this.clickHandler
      });
    },
    classes: function() {
      return ['tic-tac-toe-cell', this.state.symbol ? `${this.state.symbol}Symbol` : void 0].join(' ');
    },
    clickHandler: function() {
      if (!this.state.symbol) {
        this.setState({
          symbol: gameState.currentSymbol()
        });
        gameState.updateState(this.props.index);
        return this.props.onClick();
      }
    }
  });

  TicTacToeCellsMatrix = React.createClass({
    render: function() {
      var i;
      return div({
        className: 'tic-tac-toe--cells-matrix',
        children: (function() {
          var j, results;
          results = [];
          for (i = j = 0; j <= 8; i = ++j) {
            results.push(TicTacToeCell({
              index: i,
              gameIsBeingPlayed: this.props.gameIsBeingPlayed,
              onClick: this.props.onClick
            }));
          }
          return results;
        }).call(this)
      });
    }
  });

  EndGamePopOver = React.createClass({
    render: function() {
      return div({
        className: this.classes(),
        children: [
          NewGameButton({
            onClick: this.props.onNewGame
          }),
          TitleLabel({
            winner: gameState.winner
          })
        ]
      });
    },
    classes: function() {
      return ['tic-tac-toe--end-game-popover', this.props.gameIsBeingPlayed ? "hidden" : void 0].join(' ');
    }
  });

  TitleLabel = React.createClass({
    render: function() {
      return h1({
        className: 'tic-tac-toe--title-label',
        children: this.props.winner ? `${this.props.winner} wins` : void 0
      });
    }
  });

  NewGameButton = React.createClass({
    render: function() {
      return div({
        className: 'tic-tac-toe--new-game-button',
        children: 'New game',
        onMouseUp: this.props.onClick
      });
    }
  });

}).call(this);
