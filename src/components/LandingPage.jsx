import { Link } from 'react-router-dom'

function LandingPage() {
  const exams = ['EXAM 1', 'EXAM 2', 'EXAM 3']

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-fuchsia-100 flex items-center justify-center p-4">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-fuchsia-700 mb-4">
            Nursing Exam Practice
          </h1>
          <p className="text-xl text-fuchsia-600">
            Select an exam to begin practicing
          </p>
        </div>

        {/* Exam Selection Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exams.map((exam, index) => (
              <Link
                key={index}
                to={`/exam/${index + 1}`}
                className="group"
              >
                <div className="bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto group-hover:bg-fuchsia-50 transition-colors">
                      <span className="text-3xl font-bold text-fuchsia-600">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {exam}
                  </h2>
                  <p className="text-fuchsia-100 text-sm">
                    Click to start
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-fuchsia-700">
          <p className="text-sm">
            Practice makes perfect! Good luck on your exam! 🎓
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

