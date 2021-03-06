(function (win, doc) {
    var c = doc.querySelector('canvas'),
        $ = c.getContext('2d'),
        w = c.width = win.innerWidth,
        h = c.height = win.innerHeight

    win.addEventListener('resize', function () {
        w = c.width = win.innerWidth,
            h = c.height = win.innerHeight
    }, false)

//-----------------------------------------------------------
    var i,
        x = w / 2,
        y = h / 2,
        count = 0,
        numbers = 1000,
        polygonStars = [],
        PI = Math.PI,
        sin = Math.sin,
        cos = Math.cos,
        tan = Math.tan

    function CompoundStar(radius, init = 0) {
        this.prevX = x
        this.prevY = y
        this.radius = radius
        this.sides = getRnd(4, 40)
        this.centralAngle = PI * 2 / this.sides
        this.halfCentralAngle = this.centralAngle / 2
        this.paramAngle = this.halfCentralAngle + PI / 2
        this.concavity = this.sides < 6 ? .5 : getRnd(2, 9) / 10
        this.pivotHeight = this.radius * cos(this.halfCentralAngle)
        this.hue = getRnd(361)
        this.alpha = getRnd(5, 11) / 10
        this.init = init
        polygonStars[count++] = this
    }

    CompoundStar.prototype = {
        drawImg() {
            $.fillStyle = `hsla(${this.hue},80%,60%,${this.alpha})`
            $.beginPath()
            $.lineJoin = 'round'
            for (let i = 0; i <= this.sides; i++) {
                x = this.prevX + this.radius * cos(this.paramAngle)
                y = this.prevY + this.radius * sin(this.paramAngle)
                $.lineTo(x, y)
                x = this.prevX + (this.pivotHeight * (1 - this.concavity)) * cos(this.halfCentralAngle + this.paramAngle)
                y = this.prevY + (this.pivotHeight * (1 - this.concavity)) * sin(this.halfCentralAngle + this.paramAngle)
                $.lineTo(x, y)
                this.paramAngle += this.centralAngle
            }
            $.fill()
            this.positionTransform()
        },
        positionTransform() {
            this.R = (w > h ? h : w) / 3 * Math.exp(tan(i * tan(this.init) * PI))
            this.prevX = cos(i) * this.R + w / 2
            this.prevY = sin(i) * this.R + h / 2
            this.init = (this.init + 1.2e-5) % PI
        }
    }

    for (i = 0; i < numbers; i++) {
        new CompoundStar((w > h ? h : w) / getRnd(150, 100))
    }


    function execu() {
        $.globalCompositeOperation = 'source over'
        $.clearRect(0, 0, w, h)
        $.globalCompositeOperation = 'color-dodge'
        for (i = 0; i < polygonStars.length; i++) {
            polygonStars[i].drawImg()
        }
        win.requestAnimationFrame(execu)
    }

    function getRnd(n, m) {
        if (arguments.length < 2) {
            m = [n, n = 0][0]
        }
        if (n > m) {
            n = [m, m = n][0]
        }
        return ~~(Math.random() * (m - n)) + n
    }
    execu()
}(this, this.document))