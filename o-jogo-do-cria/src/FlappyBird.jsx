import { useState, useEffect, useRef, useCallback } from 'react'

const FlappyBird = ({ onGameEnd, onScoreUpdate }) => {
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const [gameState, setGameState] = useState('waiting') // waiting, playing, ended
  const [score, setScore] = useState(0)
  const [money, setMoney] = useState(0)

  // Game constants
  const GRAVITY = 0.6
  const JUMP_FORCE = -12
  const PIPE_WIDTH = 80
  const PIPE_GAP = 200
  const BIRD_SIZE = 30
  const PIPE_SPEED = 3

  // Game objects
  const bird = useRef({ x: 100, y: 200, velocity: 0 })
  const pipes = useRef([])
  const animationId = useRef(null)

  const resetGame = useCallback(() => {
    bird.current = { x: 100, y: 200, velocity: 0 }
    pipes.current = []
    setScore(0)
    setMoney(0)
    setGameState('waiting')
  }, [])

  const startGame = useCallback(() => {
    setGameState('playing')
    // Add first pipe
    pipes.current = [{ x: 800, passed: false }]
  }, [])

  const jump = useCallback(() => {
    if (gameState === 'waiting') {
      startGame()
    }
    if (gameState === 'playing') {
      bird.current.velocity = JUMP_FORCE
    }
  }, [gameState, startGame])

  const endGame = useCallback(() => {
    setGameState('ended')
    if (animationId.current) {
      cancelAnimationFrame(animationId.current)
    }
    onGameEnd(score, money)
  }, [score, money, onGameEnd])

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return

    const canvas = canvasRef.current
    if (!canvas) return

    // Update bird
    bird.current.velocity += GRAVITY
    bird.current.y += bird.current.velocity

    // Check ground collision
    if (bird.current.y > canvas.height - BIRD_SIZE || bird.current.y < 0) {
      endGame()
      return
    }

    // Update pipes
    pipes.current.forEach(pipe => {
      pipe.x -= PIPE_SPEED
    })

    // Add new pipes
    if (pipes.current.length === 0 || pipes.current[pipes.current.length - 1].x < 400) {
      pipes.current.push({ x: 800, passed: false })
    }

    // Remove off-screen pipes
    pipes.current = pipes.current.filter(pipe => pipe.x > -PIPE_WIDTH)

    // Check pipe collisions and scoring
    pipes.current.forEach(pipe => {
      const pipeTopHeight = (canvas.height - PIPE_GAP) / 2
      const pipeBottomY = pipeTopHeight + PIPE_GAP

      // Check collision
      if (
        bird.current.x + BIRD_SIZE > pipe.x &&
        bird.current.x < pipe.x + PIPE_WIDTH &&
        (bird.current.y < pipeTopHeight || bird.current.y + BIRD_SIZE > pipeBottomY)
      ) {
        endGame()
        return
      }

      // Check scoring
      if (!pipe.passed && bird.current.x > pipe.x + PIPE_WIDTH) {
        pipe.passed = true
        const newScore = score + 1
        const newMoney = newScore * 1.0
        setScore(newScore)
        setMoney(newMoney)
        onScoreUpdate(newScore, newMoney)
      }
    })
  }, [gameState, score, endGame, onScoreUpdate])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(1, '#16213e')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw bird (neon style)
    ctx.fillStyle = '#00ffff'
    ctx.shadowColor = '#00ffff'
    ctx.shadowBlur = 20
    ctx.fillRect(bird.current.x, bird.current.y, BIRD_SIZE, BIRD_SIZE)
    ctx.shadowBlur = 0

    // Draw pipes (neon style)
    pipes.current.forEach(pipe => {
      const pipeTopHeight = (canvas.height - PIPE_GAP) / 2
      const pipeBottomY = pipeTopHeight + PIPE_GAP

      // Top pipe
      ctx.fillStyle = '#ff0040'
      ctx.shadowColor = '#ff0040'
      ctx.shadowBlur = 15
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipeTopHeight)

      // Bottom pipe
      ctx.fillRect(pipe.x, pipeBottomY, PIPE_WIDTH, canvas.height - pipeBottomY)
      ctx.shadowBlur = 0
    })

    // Draw score
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`PONTOS: ${score}`, canvas.width / 2, 50)
    ctx.fillText(`DINHEIRO: R$ ${money.toFixed(2)}`, canvas.width / 2, 80)

    // Draw instructions
    if (gameState === 'waiting') {
      ctx.fillStyle = '#00ffff'
      ctx.font = 'bold 20px monospace'
      ctx.fillText('CLIQUE OU PRESSIONE ESPAÇO PARA COMEÇAR', canvas.width / 2, canvas.height / 2)
    }
  }, [gameState, score, money])

  const gameLoop = useCallback(() => {
    updateGame()
    draw()
    animationId.current = requestAnimationFrame(gameLoop)
  }, [updateGame, draw])

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoop()
    }
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
      }
    }
  }, [gameState, gameLoop])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        jump()
      }
    }

    const handleClick = () => {
      jump()
    }

    window.addEventListener('keydown', handleKeyPress)
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('click', handleClick)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      if (canvas) {
        canvas.removeEventListener('click', handleClick)
      }
    }
  }, [jump])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-2 border-cyan-400 rounded-lg shadow-lg shadow-cyan-400/50"
        style={{ background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' }}
      />
      {gameState === 'ended' && (
        <button
          onClick={resetGame}
          className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
        >
          JOGAR NOVAMENTE
        </button>
      )}
    </div>
  )
}

export default FlappyBird

