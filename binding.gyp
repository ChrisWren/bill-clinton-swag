{
  "targets": [
    {
      "target_name": "bill_clinton_imagemagick",
      "sources": [ "billclinton-native/bill_clinton.cc" ],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'OTHER_CFLAGS': [
          '<!@(Magick++-config --cflags)'
        ]
      },
      "libraries": [
         '<!@(Magick++-config --ldflags --libs)',
      ],
      'cflags': [
        '<!@(Magick++-config --cflags --cppflags)'
      ],
    }
  ]
}
