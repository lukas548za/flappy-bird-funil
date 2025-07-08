import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Target, Zap, DollarSign, GamepadIcon, Trophy, Star, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FlappyBird from './FlappyBird.jsx'
import './App.css'

import heroBackground from './assets/hero-background.jpg'

function App() {
  const [currentPhase, setCurrentPhase] = useState('intro')
  const [gameScore, setGameScore] = useState(0)
  const [gameMoney, setGameMoney] = useState(0)
  const [showPlotTwist, setShowPlotTwist] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleGameEnd = (finalScore, finalMoney) => {
    setGameScore(finalScore)
    setGameMoney(finalMoney)
    setTimeout(() => setShowPlotTwist(true), 2000)
  }

  const handleScoreUpdate = (score, money) => {
    setGameScore(score)
    setGameMoney(money)
  }

  const startCountdown = () => {
    setCountdown(3)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setCurrentPhase('game')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const IntroPhase = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <GamepadIcon className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-4 sm:mb-6 tracking-wider">
            OPERAÇÃO
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-red-500 mb-6 sm:mb-8">
            DINHEIRO
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-8 sm:mb-12"
        >
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 sm:mb-6 leading-relaxed px-4">
            Sua missão: Hackear o sistema e ganhar dinheiro real jogando.
          </p>
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-green-400 text-base sm:text-lg">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">R$ 1,00 por ponto conquistado</span>
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Button 
            onClick={startCountdown}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold tracking-wider transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            INICIAR OPERAÇÃO
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 sm:mt-12"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/30">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Desafio Único</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-red-500/30">
              <Star className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Experiência Imersiva</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-green-500/30">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Comunidade Exclusiva</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  const CountdownPhase = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-black px-4"
    >
      <div className="text-center">
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GamepadIcon className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl text-orange-500 mb-4">PREPARE-SE!</h2>
          <div className="text-6xl sm:text-8xl font-bold text-blue-500 mb-4">{countdown}</div>
          <p className="text-gray-400 text-sm sm:text-base">A operação começará em instantes...</p>
          <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-500 rounded-lg max-w-sm mx-auto">
            <p className="text-yellow-400 text-xs sm:text-sm">
              💡 Dica: Mantenha o dedo pronto para tocar na tela!
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  const GamePhase = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-cyan-500/30 p-3 sm:p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
            <h1 className="text-lg sm:text-2xl font-bold">OPERAÇÃO EM ANDAMENTO</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-6">
            <Badge variant="outline" className="text-green-400 border-green-400 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
              DINHEIRO: R$ {gameMoney.toFixed(2)}
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
              PONTOS: {gameScore}
            </Badge>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center w-full max-w-2xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4 sm:mb-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">HACKEAR O SISTEMA</h2>
            <p className="text-gray-400 text-sm sm:text-base">Navegue pelos obstáculos e acumule dinheiro</p>
          </motion.div>
          
          <FlappyBird 
            onGameEnd={handleGameEnd}
            onScoreUpdate={handleScoreUpdate}
          />
          
          <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
            Clique na tela ou pressione ESPAÇO para voar
          </div>
        </div>
      </div>
    </div>
  )

  const PlotTwistPhase = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black px-4"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-blue-900/30" />
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-red-500 mb-6 sm:mb-8 tracking-wider">
            PLOT TWIST
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            VOCÊ FOI FISGADO
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed mb-4 sm:mb-6 px-4">
            Este jogo é um exemplo de <span className="text-cyan-400 font-bold">funil gamificado</span>.
          </p>
          <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8">
            Você ganhou <span className="text-red-400 font-bold">R$ 0,00</span> e fez <span className="text-red-400 font-bold">{gameScore} pontos</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="space-y-4 sm:space-y-6"
        >
          <Card className="bg-gray-900/80 border-red-500/30 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">E-BOOK: FUNIL CRIA</h3>
              <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                Aprenda todos os segredos por trás deste funil gamificado e como criar o seu próprio.
              </p>
              <div className="space-y-2 sm:space-y-4 text-left text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
                <div className="flex items-center space-x-2">
                  <span>📱</span>
                  <span>Grupo WhatsApp para networking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🎮</span>
                  <span>Discord para acompanhar desenvolvimento</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🧪</span>
                  <span>Testes ao vivo de ofertas</span>
                </div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-yellow-400 text-xs sm:text-sm">
                  🎯 Do básico ao avançado - Aprenda criando!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-2xl sm:text-3xl font-bold text-green-400">R$ 24,99</span>
                <Button 
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold w-full sm:w-auto"
                  onClick={() => window.open('https://cakto.com.br', '_blank')}
                >
                  COMPRAR AGORA
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button 
              variant="outline"
              className="flex-1 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black text-sm sm:text-base"
              onClick={() => window.open('https://chat.whatsapp.com/GrCdOqSOISO29nLZvLKoOe?mode=ac_t', '_blank')}
            >
              Participar da mentoria ao vivo
            </Button>
            <Button 
              variant="outline"
              className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black text-sm sm:text-base"
              onClick={() => {
                setCurrentPhase('intro')
                setShowPlotTwist(false)
                setGameScore(0)
                setGameMoney(0)
              }}
            >
              Tentar novamente
            </Button>
          </div>

          <p className="text-gray-500 text-xs sm:text-sm">
            Mentoria com Luan Telles • instaluanmt.com
          </p>
        </motion.div>
      </div>
    </motion.div>
  )

  return (
    <div className="font-mono">
      <AnimatePresence mode="wait">
        {currentPhase === 'intro' && <IntroPhase />}
        {countdown > 0 && <CountdownPhase />}
        {currentPhase === 'game' && !showPlotTwist && <GamePhase />}
        {showPlotTwist && <PlotTwistPhase />}
      </AnimatePresence>
    </div>
  )
}

export default App

