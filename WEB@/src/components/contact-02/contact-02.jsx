import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon, MapPinIcon, MessageCircle, PhoneIcon } from "lucide-react";
import Link from "next/link";

const Contact02Page = () => (
  <>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><path className="fill-gray-600 dark:fill-yellow-400" d="M990 45H535.5A35.2 35.2 0 0 1 500 11.6 35.2 35.2 0 0 1 464.5 45H10v10h454.5A35.2 35.2 0 0 1 500 88.4 35.2 35.2 0 0 1 535.5 55H990V45Z"></path></svg>
    <div className="min-h-screen flex items-center justify-center py-16">
      <div className="w-full max-w-(--breakpoint-xl) mx-auto px-6 xl:px-0">

        <div id="contato" className="flex flex-col text-center text-6xl font-bold text-white mb-24">
          <span>Pronto Para</span>
          <span className="text-gray-600 dark:text-yellow-500">Começar?</span>
        </div>

        <b className="text-white uppercase font-semibold text-sm">
          Entre em contato conosco
        </b>
        <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white">
          Converse com nossa equipe amigável!
        </h2>
        <p className="mt-3 text-base sm:text-lg text-white/70 italic">
          Adoraríamos ouvir sua opinião. Preencha este formulário ou envie-nos um e-mail.
        </p>
        <div className="mt-24 grid lg:grid-cols-2 gap-16 md:gap-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            <div>
              <div
                className="h-12 w-12 flex items-center justify-center bg-white/5 dark:bg-white/10 text-white rounded-full">
                <MailIcon />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Email</h3>
              <p className="my-2.5 text-white">
                Nossa equipe amigável está aqui para ajudar.
              </p>
              <Link
                className="font-medium text-white"
                href="mailto:akashmoradiya3444@gmail.com">
                akashmoradiya3444@gmail.com
              </Link>
            </div>
            <div>
              <div
                className="h-12 w-12 flex items-center justify-center bg-white/5 dark:bg-white/10 text-white rounded-full">
                <MessageCircle />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Bate-papo ao vivo</h3>
              <p className="my-2.5 text-white">
                Nossa equipe amigável está aqui para ajudar.
              </p>
              <Link className="font-medium text-white" href="#">
                Iniciar novo bate-papo
              </Link>
            </div>
            <div>
              <div
                className="h-12 w-12 flex items-center justify-center bg-white/5 dark:bg-white/10 text-white rounded-full">
                <MapPinIcon />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Sede</h3>
              <p className="my-2.5 text-white">
                Venha nos cumprimentar.
              </p>
              <Link
                className="font-medium text-white"
                href="https://map.google.com"
                target="_blank">
                100 Smith Street Collingwood <br /> VIC 3066 AU
              </Link>
            </div>
            <div>
              <div
                className="h-12 w-12 flex items-center justify-center bg-white/5 dark:bg-white/10 text-white rounded-full">
                <PhoneIcon />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Telefone</h3>
              <p className="my-2.5 text-white">
                Seg-Sex das 8h às 17h.
              </p>
              <Link
                className="font-medium text-white"
                href="tel:akashmoradiya3444@gmail.com">
                +1 (555) 000-0000
              </Link>
            </div>
          </div>

          <Card className="bg-accent shadow-none py-0">
            <CardContent className="p-6 md:p-8">
              <form>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="firstName">Primeiro Nome</Label>
                    <Input
                      placeholder="Primeiro Nome"
                      id="firstName"
                      className="mt-2 bg-white h-10 shadow-none" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="lastName">Segundo Nome</Label>
                    <Input
                      placeholder="Segundo Nome"
                      id="lastName"
                      className="mt-2 bg-white h-10 shadow-none" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      placeholder="Email"
                      id="email"
                      className="mt-2 bg-white h-10 shadow-none" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      placeholder="Mensagem"
                      className="mt-2 bg-white shadow-none"
                      rows={6} />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Checkbox id="acceptTerms" className="bg-white cursor-pointer" />
                    <Label htmlFor="acceptTerms" className="gap-0">
                      You agree to our
                      <Link href="#" className="underline ml-1">
                        terms and conditions
                      </Link>
                      <span>.</span>
                    </Label>
                  </div>
                </div>
                <Button className="mt-6 w-full bg-yellow-400 text-primary hover:text-white dark:text-black cursor-pointer" size="lg">
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><path className="fill-yellow-600 dark:fill-yellow-500" d="M990 45H535.5A35.2 35.2 0 0 1 500 11.6 35.2 35.2 0 0 1 464.5 45H10v10h454.5A35.2 35.2 0 0 1 500 88.4 35.2 35.2 0 0 1 535.5 55H990V45Z"></path></svg> */}
  </>
);


export default Contact02Page;
