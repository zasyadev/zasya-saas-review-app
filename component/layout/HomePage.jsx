import React from "react";
import { Col, Row } from "antd";

function HomePage() {
  return (
    <>
      <div classNameNameNameName="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-full lg:w-full md:w-full mb-12 md:mb-0">
        <div>
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/Slides/img%20(35).webp"
            className="w-full  h-96 "
            alt="Sample image"
          />
        </div>
        <section className="pb-20 bg-gray-100 -mt-32">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap relative z-50">
              <div className="w-full md:w-4/12 px-4 flex justify-center text-center">
                <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 undefined">
                  <div className="p-4 undefined">
                    <div className="p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-md rounded-full bg-red-500">
                      <span className="material-icons text-white text-xl leading-none">
                        stars
                      </span>
                    </div>
                    <h1 className="text-gray-900 text-xl font-serif font-bold leading-normal mt-0 mb-2">
                      Awarded Agency
                    </h1>
                    <p className="text-blue-gray-700 text-base font-light leading-relaxed mt-0 mb-4">
                      Divide details about your product or agency work into
                      parts. A paragraph describing a feature will be enough.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-4/12 px-4 flex justify-center text-center">
                <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 undefined">
                  <div className="p-4 undefined">
                    <div className="p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-md rounded-full bg-light-blue-500">
                      <span className="material-icons text-white text-xl leading-none">
                        autorenew
                      </span>
                    </div>
                    <h1 className="text-gray-900 text-xl font-serif font-bold leading-normal mt-0 mb-2">
                      Free Revisions
                    </h1>
                    <p className="text-blue-gray-700 text-base font-light leading-relaxed mt-0 mb-4">
                      Keep you user engaged by providing meaningful information.
                      Remember that by this time, the user is curious.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-4/12 px-4 flex justify-center text-center">
                <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 undefined">
                  <div className="p-4 undefined">
                    <div className="p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-md rounded-full bg-teal-500">
                      <span className="material-icons text-white text-xl leading-none">
                        fingerprint
                      </span>
                    </div>
                    <h1 className="text-gray-900 text-xl font-serif font-bold leading-normal mt-0 mb-2">
                      Verified Company
                    </h1>
                    <p className="text-blue-gray-700 text-base font-light leading-relaxed mt-0 mb-4">
                      Write a few lines about each one. A paragraph describing a
                      feature will be enough. Keep you user engaged!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center mt-32">
              <div className="w-full md:w-5/12 px-4 mx-auto">
                <div className="text-blue-gray-800 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                  <span className="material-icons undefined text-3xl leading-none">
                    people
                  </span>
                </div>
                <h1 className="text-gray-900 text-3xl font-serif font-bold leading-normal mt-0 mb-2">
                  Working with us is a pleasure
                </h1>
                <p className="text-blue-gray-700 text-lg font-light leading-relaxed mt-6 mb-4">
                  {
                    "Don't let your uses guess by attaching tooltips and popoves to any element. Just make sure you enable them first via JavaScript."
                  }
                </p>
                <p className="text-blue-gray-700 text-lg font-light leading-relaxed mt-6 mb-4">
                  {
                    "  The kit comes with three pre-built pages to help you get started faster. You can change the text and images and you're good to go. Just make sure you enable them first via JavaScript."
                  }
                </p>
                <a
                  href="#pablo"
                  className="font-medium text-light-blue-500 mt-2 inline-block"
                >
                  Read More
                </a>
              </div>
              <div className="w-full md:w-4/12 px-4 mx-auto flex justify-center mt-24 lg:mt-0">
                <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 undefined">
                  <div className="p-4 undefined">
                    <h1 className="text-gray-900 text-xl font-serif font-bold leading-normal mt-0 mb-2">
                      Top Notch Services
                    </h1>
                    <p className="text-blue-gray-700 text-base font-light leading-relaxed mt-0 mb-4">
                      The Arctic Ocean freezes every winter and much of the
                      sea-ice then thaws every summer, and that process will
                      continue whatever happens.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
