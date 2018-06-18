class TicTacToe {
    constructor(players){
        this.players = players
        this.board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
        this.turn = players[0]
        this.over = false
        this.name = "tictactoe"
    }

    async start(client, message){
        this.draw(client, message)
    }

    async draw(client, message){
        let board = this.board
        let t = ''
        t += "`" + this.players[0].username + '` vs `' + this.players[1].username + "`"

        t += '\n```fix\n'
        t += '-----------------------' + '\n'
        t += '|1     |2      |3     |' + '\n' 
        t += '|   ' + board[0] + '  |   ' + board[1] + '   |   ' + board[2] + '  |\n'
        t += '|      |       |      |' + '\n'
        t += '|---------------------|' + '\n'
        t += '|4     |5      |6     |' + '\n'
        t += '|   ' + board[3] + '  |   ' + board[4] + '   |   ' + board[5] + '  |\n'
        t += '|      |       |      |' + '\n'
        t += '|---------------------|' + '\n'
        t += '|7     |8      |9     |' + '\n'
        t += '|   ' + board[6] + '  |   ' + board[7] + '   |   ' + board[8] + '  |\n'
        t += '|      |       |      |' + '\n'
        t += '-----------------------' + '\n'
        t += '```\n'
        
        
        if (! this.over){
            t += String(this.turn) + ", your turn."}

        message.channel.send(t)
    }
            

    async make_move(client, message, prefix){
        let i = parseInt(message.content.replace(prefix + "ttt move ", ""))
        if (i > 9 || i < 1 || this.board[i - 1] != ' '){
            message.channel.send('Error, can\'t place here')
            return
        }
            
        if (this.turn == this.players[0]){
            this.board[i - 1] = 'X'
            this.turn = this.players[1]
        }
        else{
            this.board[i - 1] = 'O'
            this.turn = this.players[0]
        }

        
        
        let w = this.check_win()
        
        if (w == false){
          await this.draw(client, message)}
        
        if (w != false){
            this.over = true
            if (w == 'X' || w == 'O') message.channel.send("`" + w + '` wins.')
            else message.channel.send('Tie.')}
    }
    check_win(){
        let b = this.board
        if (b[0] == b[1] && b[0] == b[2]){
            if (b[0] == 'X') return 'X'
            else if (b[0] == 'O') return 'O'}
        if (b[3] == b[4] && b[3] == b[5]){
            if (b[3] == 'X') return 'X'
            else if (b[3] == 'O') return 'O'}
        if (b[6] == b[7] && b[6] == b[8]){
            if (b[6] == 'X') return 'X'
            else if (b[6] == 'O') return 'O'}
        if (b[0] == b[3] && b[0] == b[6]){
            if (b[0] == 'X') return 'X'
            else if (b[0] == 'O') return 'O'}
        if (b[1] == b[4] && b[1] == b[7]){
            if (b[1] == 'X') return 'X'
            else if (b[1] == 'O') return 'O'}
        if (b[2] == b[5] && b[2] == b[8]){
            if (b[2] == 'X') return 'X'
            else if (b[2] == 'O') return 'O'}

        
        if (b[0] == b[4] && b[0] == b[8]){
            if (b[4] == 'X') return 'X'
            else if (b[4] == 'O') return 'O'}
        
        if (b[2] == b[4] && b[2] == b[6]){
            if (b[4] == 'X') return 'X'
            else if (b[4] == 'O') return 'O'}

        if (!b.includes(" ")) return 'T'
        return false
    }
    get_whose_turn() {return this.turn}

    is_over(){
        return this.over}

    __repr__(){
        return String(this.players[0]) + ' vs ' + String(this.players[1]) + ' playing ' + this.name + '\n'
    }
}


module.exports = TicTacToe


