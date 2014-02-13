#include "bill_clinton.h"
#include <libgen.h>
#include <string.h>

#define THROW_ERROR_EXCEPTION(x) ThrowException(v8::Exception::Error(String::New(x))); \
    scope.Close(Undefined())

Handle<Value> Generate(const Arguments& args) {
    HandleScope scope;

    if (args.Length() != 4) {
        return THROW_ERROR_EXCEPTION("generate() requires 4 arguments!");
    }

    Local<Object> *albums = new Local<Object>[4];
    Magick::Image *albumImages = new Magick::Image[4];
    Magick::Image clintonBack;
    Magick::Image clintonFront;

    for(int i = 0; i < 4; i++) {
      // Make sure arguements are objects
      if (!args[i]->IsObject()) {
          return THROW_ERROR_EXCEPTION("generate()'s arguments must all be objects");
      }

      albums[i] = Local<Object>::Cast(args[i]);

      // Make sure objects are buffer objects
      if (albums[i]->IsUndefined() || ! node::Buffer::HasInstance(albums[i])) {
          return THROW_ERROR_EXCEPTION("generate()'s arguments must all be Buffer instances");
      }

      Magick::Blob srcBlob (node::Buffer::Data(albums[i]), node::Buffer::Length(albums[i]));

      try {
          albumImages[i].read(srcBlob);
          albumImages[i].matteColor(Magick::Color("Transparent"));
          albumImages[i].virtualPixelMethod(Magick::TransparentVirtualPixelMethod);
      } catch (std::exception& err) {
          std::string msg = "image.read failed with error: ";
          msg += err.what();
          return THROW_ERROR_EXCEPTION(msg.c_str());
      } catch(...) {
          return THROW_ERROR_EXCEPTION("unhandled error");
      }
    }

    // Distort Images
    try {
        double points[16] = { 
            0,0, 107,238,
            albumImages[0].baseColumns() ,0, 262,288,
            0,albumImages[0].baseRows(), 67,384,
            albumImages[0].baseColumns(),albumImages[0].baseRows(), 212,436 };

        albumImages[0].distort(
                Magick::PerspectiveDistortion,
                16,
                points,
                true);

        double points_two[16] = {
            0,0, 118,512,
            albumImages[1].baseColumns(),0, 266,546,
            0,albumImages[1].baseRows(), 9,626,
            albumImages[1].baseColumns(),albumImages[1].baseRows(), 186,692 };

        albumImages[1].distort(
                Magick::PerspectiveDistortion,
                16,
                points_two,
                true);

        double points_three[16] = {
            0,0, 271,517,
            albumImages[2].baseColumns(),0, 436,511,
            0,albumImages[2].baseRows(), 280,651,
            albumImages[2].baseColumns(),albumImages[2].baseRows(), 501,646};

        albumImages[2].distort(
                Magick::PerspectiveDistortion,
                16,
                points_three,
                true);

        double points_four[16] = {
            0,0, 365,300,
            albumImages[3].baseColumns(),0, 473,331,
            0,albumImages[3].baseRows(), 333,425,
            albumImages[3].baseColumns(),albumImages[3].baseRows(), 436,474};

        albumImages[3].distort(
                Magick::PerspectiveDistortion,
                16,
                points_four,
                true);

        char* dir = strdup(__FILE__);
        dir = dirname(dir);
        char clintonFrontPath[100];
        char clintonBackPath[100];

        strcpy(clintonBackPath, dir);
        strcat(clintonBackPath, "/clinton.png");
        strcpy(clintonFrontPath, dir);
        strcat(clintonFrontPath, "/clintonfront.png");

        clintonBack.read(clintonBackPath);
        clintonFront.read(clintonFrontPath);

        clintonBack.composite(albumImages[0], 66 , 237, Magick::OverCompositeOp);
        clintonBack.composite(albumImages[1], 8  , 511, Magick::OverCompositeOp);
        clintonBack.composite(albumImages[2], 270, 510, Magick::OverCompositeOp);
        clintonBack.composite(albumImages[3], 332, 299, Magick::OverCompositeOp);
        clintonBack.composite(clintonFront  , 0  , 0  , Magick::OverCompositeOp);

        Magick::Blob dstBlob;
        clintonBack.write(&dstBlob);
        node::Buffer* retBuffer = node::Buffer::New( dstBlob.length() );
        memcpy( node::Buffer::Data( retBuffer->handle_ ), dstBlob.data(), dstBlob.length() );

        // Be a good citizen and clean house.
        delete[] albums;
        delete[] albumImages;

        return scope.Close( retBuffer->handle_ );

    } catch( Magick::Exception &error ){
        // Be a good citizen and clean house.
        delete[] albums;
        delete[] albumImages;

        std::string msg = "Conversion failed with ImageMagick error: ";
        msg += error.what();
        return THROW_ERROR_EXCEPTION(msg.c_str());
    }


    return THROW_ERROR_EXCEPTION("Unknown Logic Error");
}

void init(Handle<Object> target) {
  target->Set(String::NewSymbol("generate"),
      FunctionTemplate::New(Generate)->GetFunction());
}
NODE_MODULE(bill_clinton_imagemagick, init)
