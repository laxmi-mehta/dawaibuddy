import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Closing gradient call-to-action banner. */
export function CtaBanner() {
  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl bg-brand-gradient px-6 py-14 text-center shadow-float sm:px-12">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
            Take control of your medicines today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-white/85">
            Join 50,000+ Indians who understand their prescriptions with confidence.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-white text-brand hover:bg-white/90',
              )}
            >
              Create free account
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
