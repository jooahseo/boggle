class Boggle{
    constructor(btnObj, inputObj){
        this.wordSet = new Set()
        this.score = 0
        this.btn = btnObj
        this.input = inputObj
        this.btn.on('click', this.handleClick.bind(this))
        this.timerStart()
    }
    async handleClick(e){
        e.preventDefault()
        const answer = this.input.val().toLowerCase()
        if(answer.trim() === ""){
            alert('Please type a valid word!')
        }
        else{
            const res = await axios.get(`/find/${answer}`)
            this.appendToDOM(res)
        }  
        $('#answer').val("")
    }
    appendToDOM(res){
        const result = this.checkResult(res)
        $('#msg').html(result)
        $('#score').html(this.getScore())
    }
    timerStart(){
        let timeleft = 0
        const timer = setInterval(()=>{
            if(timeleft > 60){
                clearInterval(timer)
                $('#timer').text('Time expired.')
                this.btn.attr('disabled','disabled')
                this.input.attr('disabled','disabled')
                this.gameEnd()
            }
            else{
                $('#timer').text(`Time left: ${60-timeleft}`)
                timeleft +=1
            }   
        },1000)
        // setTimeout(()=>{
        //     this.btn.attr('disabled','disabled')
        //     this.input.attr('disabled','disabled')
        //     this.gameEnd()
        // },60000)
    }
    async gameEnd(){
        const response = await axios.post('/endgame',{
            score : this.score
        })
        console.log(response)
        let result = ""
        if(response.data.newRecord){
            result = `New record: ${this.score}`
        }else{
            result = `Final score: ${this.score}`
        }
        $('#msg').html(result)
    }
    getScore(){
        return this.score
    }
    addSet(word){
        this.wordSet.add(word)
    }
    checkSet(word){
        if(this.wordSet.has(word)){
            return true
        }
        return false
    }
    checkResult(res){
        const word = res.data.search_term
        const result = res.data.result
        if(this.checkSet(word)){
            return `<p>"${word}" is already used.<p><br>`
        }else{
            if(result === "ok"){
                this.addSet(word)
                this.score += word.length
                return `<p>"${word}" is valid.</p><br>`
            }else if(result === "not-on-board"){
                return`<p>"${word}" is not on the board.</p><br>`
            }else{
                return `<p>"${word}" is not a word.</p><br>`
            }
        }
    }
}


const boggle = new Boggle($("#btnSubmit"), $('#answer'))

